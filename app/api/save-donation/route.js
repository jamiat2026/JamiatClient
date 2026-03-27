import { dbConnect } from "../../../lib/dbConnect";
import Donation from "../../../lib/models/donation";
import Donor from "../../../lib/models/donor";
import nodemailer from "nodemailer";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

import { corsHeaders } from "../../layout";

export const runtime = "nodejs";

// ---------- CORS ----------
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// ---------- GET ----------
export async function GET() {
  await dbConnect();
  const donations = await Donation.find().sort({ createdAt: -1 });
  return new Response(JSON.stringify(donations), {
    status: 200,
    headers: corsHeaders,
  });
}

// ---------- PDF Generator with custom font ----------
async function generatePdfBuffer(donation, donor) {
  const pdfDoc = await PDFDocument.create();

  // ✅ Register fontkit
  pdfDoc.registerFontkit(fontkit);

  // ✅ Load TTF font that supports ₹
  const fontPath = path.join(process.cwd(), "public", "Roboto-Regular.ttf");
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const page = pdfDoc.addPage([595.28, 841.89]);
  const { height, width } = page.getSize();

  const margin = 40;
  const contentWidth = width - margin * 2;
  const topY = height - 60;

  const drawText = (text, x, yTop, size = 11) => {
    page.drawText(text, {
      x,
      y: yTop - size,
      size,
      font: customFont,
      color: rgb(0, 0, 0),
    });
  };

  const rightAlignX = (text, rightX, size = 11) =>
    rightX - customFont.widthOfTextAtSize(text, size);

  const address = (() => {
    if (!donor.address) return "N/A";
    if (typeof donor.address === "string") return donor.address || "N/A";
    const parts = [
      donor.address.street,
      donor.address.city,
      donor.address.state,
      donor.address.country,
      donor.address.zipCode,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "N/A";
  })();

  const city =
    typeof donor.address === "object" && donor.address?.city
      ? donor.address.city
      : "N/A";
  const pincode =
    typeof donor.address === "object" && donor.address?.zipCode
      ? donor.address.zipCode
      : "N/A";

  const logoPath = path.join(process.cwd(), "public", "Logo.png");
  if (fs.existsSync(logoPath)) {
    const logoBytes = fs.readFileSync(logoPath);
    const logo = await pdfDoc.embedPng(logoBytes);
    // Add dark background for transparent logo
    page.drawRectangle({
      x: margin + 6,
      y: topY - 74,
      width: 68,
      height: 68,
      color: rgb(0, 0, 0),
    });
    page.drawImage(logo, {
      x: margin + 10,
      y: topY - 70,
      width: 60,
      height: 60,
    });
  }

  // Header box
  const headerHeight = 90;
  page.drawRectangle({
    x: margin,
    y: topY - headerHeight,
    width: contentWidth,
    height: headerHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  const title = "Jamiat Ulama-i-Hind";
  drawText(
    title,
    margin + contentWidth / 2 - customFont.widthOfTextAtSize(title, 16) / 2,
    topY - 18,
    16
  );
  drawText(
    "No. 1, Bahadur Shah Zafar Marg, New Delhi 110002",
    margin + 120,
    topY - 42,
    10
  );

  const phoneLabel = "Phone Number";
  const phoneNumber = "+91 9868990544";
  const tollLabel = "Toll Free Number";
  const tollNumber = "+91 11 23317729";
  const rightX = margin + contentWidth - 10;
  drawText(phoneLabel, rightAlignX(phoneLabel, rightX, 10), topY - 12, 10);
  drawText(phoneNumber, rightAlignX(phoneNumber, rightX, 10), topY - 26, 10);
  drawText(tollLabel, rightAlignX(tollLabel, rightX, 10), topY - 44, 10);
  drawText(tollNumber, rightAlignX(tollNumber, rightX, 10), topY - 58, 10);

  // Table
  const tableTop = topY - headerHeight - 15;
  const rowHeights = [52, 120, 36, 36];
  const tableHeight = rowHeights.reduce((a, b) => a + b, 0);
  const tableBottom = tableTop - tableHeight;
  const splitX = margin + contentWidth * 0.45;

  page.drawRectangle({
    x: margin,
    y: tableBottom,
    width: contentWidth,
    height: tableHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  let currentY = tableTop;
  for (let i = 0; i < rowHeights.length - 1; i++) {
    currentY -= rowHeights[i];
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: margin + contentWidth, y: currentY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  }

  page.drawLine({
    start: { x: splitX, y: tableBottom },
    end: { x: splitX, y: tableTop },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  const paddingX = 10;
  const paddingY = 12;

  // Row 1
  const r1Top = tableTop;
  drawText(`Receipt No:- ${donation._id}`, margin + paddingX, r1Top - paddingY, 10);
  drawText(
    `JUH No:- ${donation.paymentId || "N/A"}`,
    margin + paddingX,
    r1Top - (paddingY + 14),
    10
  );
  drawText(
    `Bank No:- ${donation.paymentId || "N/A"}`,
    margin + paddingX,
    r1Top - (paddingY + 28),
    10
  );
  drawText(
    `Date:- ${new Date(donation.createdAt).toLocaleDateString("en-IN")}`,
    splitX + paddingX,
    r1Top - paddingY,
    10
  );

  // Row 2
  const r2Top = r1Top - rowHeights[0];
  drawText("Receiver:", margin + paddingX, r2Top - paddingY, 10);
  drawText("Jamiat Ulama-i-Hind", margin + paddingX, r2Top - (paddingY + 14), 10);
  drawText("For:", margin + paddingX, r2Top - (paddingY + 36), 10);
  drawText(
    donation.projectName || "Hadiya",
    margin + paddingX,
    r2Top - (paddingY + 50),
    10
  );

  drawText("Payee:", splitX + paddingX, r2Top - paddingY, 10);
  drawText(donor.name || "N/A", splitX + 60, r2Top - paddingY, 10);
  drawText("Address:", splitX + paddingX, r2Top - (paddingY + 14), 10);
  drawText(address, splitX + 70, r2Top - (paddingY + 14), 10);
  drawText("City:", splitX + paddingX, r2Top - (paddingY + 32), 10);
  drawText(city, splitX + 45, r2Top - (paddingY + 32), 10);
  drawText("Pincode:", splitX + 170, r2Top - (paddingY + 32), 10);
  drawText(pincode, splitX + 235, r2Top - (paddingY + 32), 10);
  drawText("Mobile:", splitX + paddingX, r2Top - (paddingY + 50), 10);
  drawText(donor.phoneNumber || "N/A", splitX + 60, r2Top - (paddingY + 50), 10);

  // Row 3
  const r3Top = r2Top - rowHeights[1];
  drawText("Donation Amount Paid", margin + paddingX, r3Top - paddingY, 10);
  drawText(`INR ${donation.amount}`, splitX + paddingX, r3Top - paddingY, 10);

  // Row 4
  const r4Top = r3Top - rowHeights[2];
  drawText("Generated By", margin + paddingX, r4Top - paddingY, 10);
  drawText(donor.name || "N/A", splitX + paddingX, r4Top - paddingY, 10);

  // Objectives
  let objY = tableBottom - 25;
  drawText("Objectives of Jamiat Ulama-i-Hind", margin + 8, objY, 11);
  objY -= 16;
  const objectives = [
    "1. Protection of Islamic beliefs, identity, heritage and places of worship.",
    "2. Securing and safeguarding the civil, religious, cultural and educational rights of Muslims.",
    "3. Social, educational and religious reform among Muslims.",
    "4. Establishment of institutions for progress and stability in educational, cultural, economic and social affairs of Muslims.",
    "5. Fostering and stabilizing amicable relations between different communities living in the Union of India, in accordance with the teachings of Islam.",
    "6. Revival of Arabic and Islamic studies and framing syllabus and curriculum according to needs of the present age.",
    "7. Dissemination and propagation of the teachings of Islam.",
    "8. Management and protection of Islamic Aukaf.",
  ];
  for (const line of objectives) {
    drawText(line, margin + 12, objY, 9);
    objY -= 12;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
// ---------- Email with Nodemailer ----------
async function sendEmailWithPdf(toEmail, pdfBuffer) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("Missing SMTP configuration (SMTP_HOST/SMTP_USER/SMTP_PASS)");
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  const secure =
    process.env.SMTP_SECURE === "true" ? true : port === 465 ? true : false;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  await transporter.verify();
  console.log("✅ SMTP verified.");

  const info = await transporter.sendMail({
    from: `"Jamiat Admin" <${user}>`,
    to: toEmail,
    subject: "Donation Certificate",
    text: `Dear Donor,\n\nThank you for your generous donation. Please find your Donation Certificate attached.\n\nWarm regards,\nJamiat Admin`,
    attachments: [
      {
        filename: "donationcertificate.pdf",
        content: pdfBuffer,
      },
    ],
  });
  console.log("📤 SMTP response:", info.response);
  console.log("📨 Message ID:", info.messageId);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();

  // Save donation
  const donation = await Donation.create({
    name: data.name,
    email: data.email,
    amount: data.amount,
    donationType: data.donationType,
    donationFrequency: data.donationFrequency,
    paymentId: data.paymentId,
    projectId: data.projectId,
    projectName: data.projectName,
    address: data.address || "",
  });

  // Update donor
  let donor = await Donor.findOne({ email: data.email });
  if (donor) {
    donor.totalDonated += data.amount;
    donor.donations = donor.donations || [];
    if (
      !donor.donations.some((id) => id.toString() === donation._id.toString())
    ) {
      donor.donations.push(donation._id);
    }
    if (
      data.projectId &&
      (!donor.projectsDonatedTo ||
        !donor.projectsDonatedTo.includes(data.projectId))
    ) {
      donor.totalProjects += 1;
      donor.projectsDonatedTo = donor.projectsDonatedTo || [];
      donor.projectsDonatedTo.push(data.projectId);
    }
    await donor.save();
  } else {
    donor = await Donor.create({
      name: data.name,
      email: data.email,
      address: data.address || "",
      profilePicture: "",
      totalDonated: data.amount,
      totalProjects: data.projectId ? 1 : 0,
      projectsDonatedTo: data.projectId ? [data.projectId] : [],
      donations: [donation._id],
    });
  }

  // Generate PDF and send email
  try {
    const pdfBuffer = await generatePdfBuffer(donation, donor);
    await sendEmailWithPdf(donor.email, pdfBuffer);
    console.log("✅ PDF emailed successfully.");
  } catch (err) {
    console.error("❌ Error sending PDF email:", err);
  }

  return new Response(JSON.stringify(donation), {
    status: 201,
    headers: corsHeaders,
  });
}
