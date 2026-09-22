const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Small Business CRM database...");

  // Clear existing data
  await prisma.followUp.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.settings.deleteMany();

  // 1. Seed Business Settings
  const settings = await prisma.settings.create({
    data: {
      businessName: "Apex Solutions CRM",
      email: "contact@apexsolutions.com",
      phone: "+91 98765 43210",
      address: "Plot 42, Cyber Hub, Bengaluru, Karnataka, India",
      currency: "₹",
      taxRate: 18.0,
    },
  });
  console.log("Created Settings:", settings.businessName);

  // 2. Seed Customers
  const customersData = [
    {
      name: "Aarav Sharma",
      email: "aarav.sharma@techbridge.in",
      phone: "+91 98112 34567",
      company: "TechBridge Digital",
      address: "MG Road, Bengaluru",
      status: "Active",
    },
    {
      name: "Priya Patel",
      email: "priya@novacarepharma.com",
      phone: "+91 98223 45678",
      company: "NovaCare Healthcare",
      address: "Bandra Kurla Complex, Mumbai",
      status: "Active",
    },
    {
      name: "Rohan Verma",
      email: "rohan.v@omnilogistics.com",
      phone: "+91 98334 56789",
      company: "Omni Logistics Co.",
      address: "Sector 18, Gurugram",
      status: "Active",
    },
    {
      name: "Ananya Iyer",
      email: "ananya@urbanpulse.media",
      phone: "+91 98445 67890",
      company: "Urban Pulse Media",
      address: "Koramangala, Bengaluru",
      status: "Active",
    },
    {
      name: "Vikram Malhotra",
      email: "vikram@malhotrafoods.in",
      phone: "+91 98556 78901",
      company: "Malhotra Gourmet Foods",
      address: "Connaught Place, New Delhi",
      status: "Active",
    },
    {
      name: "Meera Nair",
      email: "meera.nair@ecoverde.org",
      phone: "+91 98667 89012",
      company: "EcoVerde Sustainable Solutions",
      address: "Kakkanad, Kochi",
      status: "Potential",
    },
    {
      name: "Karan Johar",
      email: "karan@vertexsol.com",
      phone: "+91 98778 90123",
      company: "Vertex Architecture",
      address: "Banjara Hills, Hyderabad",
      status: "Active",
    },
    {
      name: "Sneha Sen",
      email: "sneha.sen@brightfuture.edu",
      phone: "+91 98889 01234",
      company: "Bright Future Academy",
      address: "Salt Lake, Kolkata",
      status: "Inactive",
    },
  ];

  const customers = [];
  for (const c of customersData) {
    const created = await prisma.customer.create({ data: c });
    customers.push(created);
  }
  console.log(`Created ${customers.length} Customers`);

  // 3. Seed Leads
  const leadsData = [
    {
      name: "Rajesh Kothari",
      email: "rajesh@kotharicorp.com",
      phone: "+91 97111 22233",
      source: "LinkedIn",
      notes: "Looking for cloud ERP migration and CRM software package.",
      status: "Qualified",
    },
    {
      name: "Divya Kapoor",
      email: "divya.k@finserve.in",
      phone: "+91 97222 33344",
      source: "Website",
      notes: "Requested enterprise tier demo and SLA pricing.",
      status: "New",
    },
    {
      name: "Aditya Deshmukh",
      email: "aditya@zenithauto.com",
      phone: "+91 97333 44455",
      source: "Referral",
      notes: "Referred by Aarav Sharma. Interested in inventory sync.",
      status: "Contacted",
    },
    {
      name: "Pooja Reddy",
      email: "pooja@zenstudios.com",
      phone: "+91 97444 55566",
      source: "Cold Call",
      notes: "Followed up on email marketing sequence.",
      status: "New",
    },
    {
      name: "Sameer Joshi",
      email: "sameer@crestretail.com",
      phone: "+91 97555 66677",
      source: "Conference",
      notes: "Met at TechExpo 2026. Signed initial SLA agreement.",
      status: "Converted",
    },
    {
      name: "Neha Gupta",
      email: "neha@guptatraders.in",
      phone: "+91 97666 77788",
      source: "Website",
      notes: "Decided to postpone budget to next fiscal quarter.",
      status: "Lost",
    },
    {
      name: "Manish Agarwal",
      email: "manish@agarwalinfra.com",
      phone: "+91 97777 88899",
      source: "Google Search",
      notes: "Needs multi-location billing and custom invoice templates.",
      status: "Qualified",
    },
    {
      name: "Simran Kaur",
      email: "simran@bluehorizon.io",
      phone: "+91 97888 99900",
      source: "LinkedIn",
      notes: "Evaluating CRM alternatives against Salesforce.",
      status: "Contacted",
    },
  ];

  const leads = [];
  for (const l of leadsData) {
    const created = await prisma.lead.create({ data: l });
    leads.push(created);
  }
  console.log(`Created ${leads.length} Leads`);

  // 4. Seed Sales (Spanning dates to generate rich graphs)
  const now = new Date();
  const getPastDate = (daysAgo) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  const salesData = [
    {
      customerId: customers[0].id,
      productName: "CRM Enterprise Annual License",
      amount: 48000,
      status: "Completed",
      paymentMethod: "Bank Transfer",
      saleDate: getPastDate(90),
    },
    {
      customerId: customers[1].id,
      productName: "Custom Analytics & Reporting Module",
      amount: 25000,
      status: "Completed",
      paymentMethod: "Card",
      saleDate: getPastDate(75),
    },
    {
      customerId: customers[2].id,
      productName: "Cloud Integration & Data Migration",
      amount: 35000,
      status: "Completed",
      paymentMethod: "Bank Transfer",
      saleDate: getPastDate(60),
    },
    {
      customerId: customers[3].id,
      productName: "Social Media Campaign Automation",
      amount: 18500,
      status: "Completed",
      paymentMethod: "UPI",
      saleDate: getPastDate(45),
    },
    {
      customerId: customers[4].id,
      productName: "Inventory Sync Microservice",
      amount: 22000,
      status: "Completed",
      paymentMethod: "Card",
      saleDate: getPastDate(30),
    },
    {
      customerId: customers[0].id,
      productName: "Dedicated SLA Support Package",
      amount: 12000,
      status: "Completed",
      paymentMethod: "Bank Transfer",
      saleDate: getPastDate(20),
    },
    {
      customerId: customers[6].id,
      productName: "Architectural 3D Asset Portal",
      amount: 40000,
      status: "Completed",
      paymentMethod: "Bank Transfer",
      saleDate: getPastDate(15),
    },
    {
      customerId: customers[1].id,
      productName: "HIPAA Compliant Data Backup Extension",
      amount: 15000,
      status: "Completed",
      paymentMethod: "Card",
      saleDate: getPastDate(10),
    },
    {
      customerId: customers[3].id,
      productName: "Quarterly Marketing Retainer",
      amount: 30000,
      status: "Pending",
      paymentMethod: "UPI",
      saleDate: getPastDate(5),
    },
    {
      customerId: customers[5].id,
      productName: "Green Certification Audit Module",
      amount: 16000,
      status: "Pending",
      paymentMethod: "Card",
      saleDate: getPastDate(2),
    },
    {
      customerId: customers[2].id,
      productName: "Fleet Tracking API Gateway",
      amount: 28000,
      status: "Completed",
      paymentMethod: "Bank Transfer",
      saleDate: getPastDate(1),
    },
    {
      customerId: customers[7].id,
      productName: "Student Portal Integration",
      amount: 14000,
      status: "Cancelled",
      paymentMethod: "Cash",
      saleDate: getPastDate(100),
    },
  ];

  for (const s of salesData) {
    await prisma.sale.create({ data: s });
  }
  console.log(`Created ${salesData.length} Sales`);

  // 5. Seed FollowUps
  const followUpsData = [
    {
      customerId: customers[0].id,
      leadId: null,
      date: new Date(Date.now() + 86400000 * 2), // in 2 days
      note: "Quarterly business review & renewal discussion with Aarav",
      status: "Pending",
    },
    {
      customerId: customers[1].id,
      leadId: null,
      date: new Date(Date.now() + 86400000 * 4), // in 4 days
      note: "Review NovaCare healthcare compliance audit logs",
      status: "Pending",
    },
    {
      customerId: null,
      leadId: leads[0].id,
      date: new Date(Date.now() + 86400000 * 1), // tomorrow
      note: "Demo cloud ERP architecture to Rajesh Kothari",
      status: "Pending",
    },
    {
      customerId: null,
      leadId: leads[1].id,
      date: new Date(Date.now() + 86400000 * 3), // in 3 days
      note: "Share enterprise pricing matrix with Divya Kapoor",
      status: "Pending",
    },
    {
      customerId: customers[2].id,
      leadId: null,
      date: getPastDate(5),
      note: "Confirm API credentials handover for Omni Logistics",
      status: "Completed",
    },
    {
      customerId: null,
      leadId: leads[4].id,
      date: getPastDate(10),
      note: "Initial contract signing with Sameer Joshi (Converted)",
      status: "Completed",
    },
  ];

  for (const f of followUpsData) {
    await prisma.followUp.create({ data: f });
  }
  console.log(`Created ${followUpsData.length} Follow-ups`);

  // 6. Seed Employees
  const employeesData = [
    {
      name: "Siddharth Mehta",
      email: "siddharth@apexsolutions.com",
      phone: "+91 99001 11222",
      role: "Sales Director",
      department: "Sales",
      salary: 120000,
      status: "Active",
    },
    {
      name: "Tanvi Saxena",
      email: "tanvi@apexsolutions.com",
      phone: "+91 99002 22333",
      role: "Senior Account Executive",
      department: "Sales",
      salary: 85000,
      status: "Active",
    },
    {
      name: "Arjun Rampal",
      email: "arjun@apexsolutions.com",
      phone: "+91 99003 33444",
      role: "Customer Success Manager",
      department: "Support",
      salary: 75000,
      status: "Active",
    },
    {
      name: "Deepika Padukone",
      email: "deepika@apexsolutions.com",
      phone: "+91 99004 44555",
      role: "Marketing Specialist",
      department: "Marketing",
      salary: 68000,
      status: "Active",
    },
    {
      name: "Kabir Singh",
      email: "kabir@apexsolutions.com",
      phone: "+91 99005 55666",
      role: "Technical Implementation Lead",
      department: "Engineering",
      salary: 95000,
      status: "Active",
    },
  ];

  for (const e of employeesData) {
    await prisma.employee.create({ data: e });
  }
  console.log(`Created ${employeesData.length} Employees`);

  console.log("Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
