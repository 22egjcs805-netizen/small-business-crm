const express = require("express");
const router = express.Router();
const prisma = require("../config/database");

// Get business settings
router.get("/", async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create default settings if not exists
      settings = await prisma.settings.create({
        data: {
          businessName: "Apex Solutions CRM",
          email: "contact@apexsolutions.com",
          phone: "+91 98765 43210",
          address: "Plot 42, Cyber Hub, Bengaluru, India",
          currency: "₹",
          taxRate: 18.0,
        },
      });
    }

    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Failed to load settings" });
  }
});

// Update business settings
router.put("/", async (req, res) => {
  try {
    const { businessName, email, phone, address, currency, taxRate } = req.body;

    let settings = await prisma.settings.findFirst();

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          businessName: businessName ? businessName.trim() : undefined,
          email: email ? email.trim() : undefined,
          phone: phone ? phone.trim() : undefined,
          address: address ? address.trim() : undefined,
          currency: currency || undefined,
          taxRate: taxRate !== undefined ? Number(taxRate) : undefined,
        },
      });
    } else {
      settings = await prisma.settings.create({
        data: {
          businessName: businessName || "Apex Solutions CRM",
          email,
          phone,
          address,
          currency: currency || "₹",
          taxRate: taxRate ? Number(taxRate) : 0,
        },
      });
    }

    res.json({
      success: true,
      message: "Business settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

module.exports = router;
