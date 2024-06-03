const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 50000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(bodyParser.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;

const curpRegex =
  /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;

const authenticate = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: "Acceso no autorizado, token requerido." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token no válido." });
    }
    req.user = user;
    next();
  });
};

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const getNextAvailableDate = async () => {
  const result = await pool.query(
    "SELECT date FROM appointments ORDER BY date DESC LIMIT 1"
  );
  let nextDate;
  if (result.rows.length === 0) {
    nextDate = new Date();
  } else {
    nextDate = new Date(result.rows[0].date);
  }
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate.toISOString().slice(0, 10);
};

// CRUD
app.get("/api/appointments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM appointments");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cita no encontrada." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/appointments", async (req, res) => {
  try {
    const { curp } = req.body;

    // CURP Validatin
    if (!curpRegex.test(curp)) {
      return res.status(400).json({ error: "CURP no válido." });
    }

    // User exist Validation
    const userResult = await pool.query("SELECT * FROM users WHERE curp = $1", [
      curp,
    ]);
    let user;
    if (userResult.rows.length === 0) {
      const newUserResult = await pool.query(
        "INSERT INTO users (curp) VALUES ($1) RETURNING *",
        [curp]
      );
      user = newUserResult.rows[0];
    } else {
      user = userResult.rows[0];
    }

    // Get nextb date available
    const date = await getNextAvailableDate();

    const currentDate = new Date().toISOString().slice(0, 10);
    const curpResult = await pool.query(
      "SELECT * FROM appointments WHERE curp = $1 AND date >= $2",
      [curp, currentDate]
    );
    if (curpResult.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "El CURP ya tiene una cita registrada en el futuro." });
    }

    const result = await pool.query(
      "INSERT INTO appointments (curp, date) VALUES ($1, $2) RETURNING *",
      [curp, date]
    );

    const token = jwt.sign({ id: user.id, curp: user.curp }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ appointment: result.rows[0], user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/appointments/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const appointmentResult = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [id]
    );
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Cita no encontrada." });
    }
    if (appointmentResult.rows[0].curp !== req.user.curp) {
      return res
        .status(403)
        .json({ error: "Acceso no autorizado para modificar esta cita." });
    }

    const dateCheckResult = await pool.query(
      "SELECT * FROM appointments WHERE date = $1 AND id != $2",
      [date, id]
    );
    if (dateCheckResult.rows.length > 0) {
      return res.status(400).json({
        error:
          "La fecha seleccionada ya está ocupada. Por favor, seleccione otra fecha.",
      });
    }

    const result = await pool.query(
      "UPDATE appointments SET date = $1 WHERE id = $2 RETURNING *",
      [date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/appointments/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const appointmentResult = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [id]
    );
    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Cita no encontrada." });
    }
    if (appointmentResult.rows[0].curp !== req.user.curp) {
      return res
        .status(403)
        .json({ error: "Acceso no autorizado para eliminar esta cita." });
    }

    await pool.query("DELETE FROM appointments WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
