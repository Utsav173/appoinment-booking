/**
 * AppointmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASS,
  },
});
module.exports = {
  create: async function (req, res) {
    try {
      const appointmentData = req.body;
      if (!appointmentData || !Object.keys(appointmentData).length) {
        return res.status(400).json({ error: "Appointment data missing" });
      }
      const appointment = await Appointment.create(appointmentData).fetch();

      // Send email to confirm appointment

      const mailOptions = {
        from: "your_email@example.com",
        to: appointment.email,
        subject: "Appointment Confirmation",
        html: `
              <html>
                <head>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      color: #333;
                    }
                    h1 {
                      font-size: 24px;
                      margin-bottom: 0;
                    }
                    p {
                      margin-top: 0;
                    }
                    table {
                      border-collapse: collapse;
                      width: 100%;
                    }
                    th, td {
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: left;
                    }
                    th {
                      background-color: #f2f2f2;
                    }
                  </style>
                </head>
                <body>
                  <h1>Appointment Confirmation</h1>
                  <p>Hi ${appointmentData.patientName},</p>
                  <p>Your appointment with the hospital has been scheduled for:</p>
                  <table>
                    <tr>
                      <th>Date</th>
                      <td>${appointmentData.date}</td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>${appointmentData.phone}</td>
                    </tr>
                    <tr>
                      <th>Department</th>
                      <td>${appointmentData.patientName}</td>
                    </tr>
                    <tr>
                      <th>hospital Name</th>
                      <td>${appointmentData.hospitalName}</td>
                    </tr>
                    <tr>
                      <th>hospital Location</th>
                      <td>${appointmentData.location}</td>
                    </tr>
                  </table>
                  <p>Thank you for choosing our hospital.</p>
                </body>
              </html>
            `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.status(201).json(appointment);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  read: async function (req, res) {
    try {
      const appointments = await Appointment.find();
      return res.json(appointments);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  readOne: async function (req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Appointment id missing" });
      }
      const appointments = await Appointment.findOne({ id: req.params.id });
      if (!appointments) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      return res.json(appointments);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  update: async function (req, res) {
    try {
      const appointmentData = req.body;
      if (!appointmentData || !Object.keys(appointmentData).length) {
        return res.status(400).json({ error: "Appointment data missing" });
      }
      if (!req.params.id) {
        return res.status(400).json({ error: "Appointment id missing" });
      }
      const appointment = await Appointment.updateOne({
        id: req.params.id,
      }).set(appointmentData);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      return res.json(appointment);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  delete: async function (req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ error: "Appointment id missing" });
      }
      const appointment = await Appointment.destroyOne({ id: req.params.id });
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      return res.status(204).json();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};
