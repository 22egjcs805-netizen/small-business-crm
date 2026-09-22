import { useEffect, useState } from "react";
import "./index.css";
import Sidebar from "./components/Sidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  // Notifications Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Settings
  const [settings, setSettings] = useState({
    businessName: "Apex Solutions CRM",
    email: "contact@apexsolutions.com",
    phone: "+91 98765 43210",
    address: "Plot 42, Cyber Hub, Bengaluru, India",
    currency: "₹",
    taxRate: 18,
  });

  // Customers
  const [customers, setCustomers] = useState([]);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    status: "Active",
  });
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerStatusFilter, setCustomerStatusFilter] = useState("All");

  // Leads
  const [leads, setLeads] = useState([]);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Website",
    notes: "",
    status: "New",
  });
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("All");

  // Sales
  const [sales, setSales] = useState([]);
  const [saleForm, setSaleForm] = useState({
    customerId: "",
    productName: "",
    amount: "",
    status: "Completed",
    paymentMethod: "Card",
  });
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [saleSearch, setSaleSearch] = useState("");

  // Employees
  const [employees, setEmployees] = useState([]);
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "Sales",
    salary: "",
  });
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [employeeSearch, setEmployeeSearch] = useState("");

  // Follow-ups
  const [followUps, setFollowUps] = useState([]);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [editingFollowUpId, setEditingFollowUpId] = useState(null);
  const [followUpForm, setFollowUpForm] = useState({
    customerId: "",
    leadId: "",
    date: "",
    note: "",
    status: "Pending",
  });

  // Reports & Analytics
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageTitle = {
    Dashboard: "Dashboard",
    Customers: "Customers Management",
    Leads: "Leads Management",
    Sales: "Sales Management",
    "Follow-Ups": "Follow-up Management",
    FollowUps: "Follow-up Management",
    Reports: "Reports & Analytics",
    Employees: "Employee Management",
    Settings: "Business Settings",
  };

  /* =========================
     API FETCH CALLS
  ========================= */

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      const data = await res.json();
      if (data && data.businessName) setSettings(data);
    } catch (e) {
      console.error("Settings fetch error:", e);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/customers`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Customers fetch error:", e);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_URL}/leads`);
      const data = await res.json();
      setLeads(data.leads || (Array.isArray(data) ? data : []));
    } catch (e) {
      console.error("Leads fetch error:", e);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_URL}/sales`);
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Sales fetch error:", e);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/employees`);
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Employees fetch error:", e);
    }
  };

  const fetchFollowUps = async () => {
    try {
      const res = await fetch(`${API_URL}/followups`);
      const data = await res.json();
      setFollowUps(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Followups fetch error:", e);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/reports`);
      const data = await res.json();
      setReportsData(data);
    } catch (e) {
      console.error("Reports fetch error:", e);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchCustomers();
    fetchLeads();
    fetchSales();
    fetchEmployees();
    fetchFollowUps();
    fetchReports();
  }, []);

  // Refresh reports when navigating to Dashboard or Reports
  useEffect(() => {
    if (activePage === "Dashboard" || activePage === "Reports") {
      fetchReports();
    }
  }, [activePage]);

  /* =========================
     CSV EXPORT HANDLER
  ========================= */

  const handleExport = (type) => {
    window.open(`${API_URL}/export/${type}`, "_blank");
    showToast(`Downloading ${type} CSV export...`);
  };

  /* =========================
     CUSTOMER HANDLERS
  ========================= */

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingCustomerId ? `${API_URL}/customers/${editingCustomerId}` : `${API_URL}/customers`;
      const method = editingCustomerId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerForm),
      });

      if (!res.ok) throw new Error("Failed to save customer");
      await fetchCustomers();
      showToast(editingCustomerId ? "Customer updated successfully!" : "New customer created!");
      setCustomerForm({ name: "", email: "", phone: "", company: "", address: "", status: "Active" });
      setEditingCustomerId(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const editCustomer = (c) => {
    setEditingCustomerId(c.id);
    setCustomerForm({
      name: c.name || "",
      email: c.email || "",
      phone: c.phone || "",
      company: c.company || "",
      address: c.address || "",
      status: c.status || "Active",
    });
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer? This will also remove associated followups.")) return;
    try {
      const res = await fetch(`${API_URL}/customers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete customer");
      await fetchCustomers();
      showToast("Customer deleted");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  /* =========================
     LEAD HANDLERS
  ========================= */

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingLeadId ? `${API_URL}/leads/${editingLeadId}` : `${API_URL}/leads`;
      const method = editingLeadId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });

      if (!res.ok) throw new Error("Failed to save lead");
      await fetchLeads();
      showToast(editingLeadId ? "Lead updated successfully!" : "New lead added to pipeline!");
      setLeadForm({ name: "", email: "", phone: "", source: "Website", notes: "", status: "New" });
      setEditingLeadId(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const editLead = (l) => {
    setEditingLeadId(l.id);
    setLeadForm({
      name: l.name || "",
      email: l.email || "",
      phone: l.phone || "",
      source: l.source || "Website",
      notes: l.notes || "",
      status: l.status || "New",
    });
  };

  const convertLeadToCustomer = async (lead) => {
    if (!window.confirm(`Convert "${lead.name}" directly into an active Customer?`)) return;
    try {
      const res = await fetch(`${API_URL}/leads/${lead.id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: `${lead.name}'s Enterprise` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Conversion failed");
      await fetchLeads();
      await fetchCustomers();
      showToast(`🎉 ${lead.name} successfully converted to an active Customer!`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      const res = await fetch(`${API_URL}/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete lead");
      await fetchLeads();
      showToast("Lead deleted");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  /* =========================
     SALES HANDLERS
  ========================= */

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSaleId ? `${API_URL}/sales/${editingSaleId}` : `${API_URL}/sales`;
      const method = editingSaleId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: saleForm.customerId ? Number(saleForm.customerId) : null,
          productName: saleForm.productName,
          amount: Number(saleForm.amount),
          status: saleForm.status,
          paymentMethod: saleForm.paymentMethod,
        }),
      });

      if (!res.ok) throw new Error("Failed to save sale");
      await fetchSales();
      await fetchReports();
      showToast(editingSaleId ? "Sale updated!" : "New sale recorded!");
      setSaleForm({ customerId: "", productName: "", amount: "", status: "Completed", paymentMethod: "Card" });
      setEditingSaleId(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const editSale = (s) => {
    setEditingSaleId(s.id);
    setSaleForm({
      customerId: s.customerId ? String(s.customerId) : "",
      productName: s.productName || "",
      amount: s.amount || "",
      status: s.status || "Completed",
      paymentMethod: s.paymentMethod || "Card",
    });
  };

  const deleteSale = async (id) => {
    if (!window.confirm("Delete this sale record?")) return;
    try {
      const res = await fetch(`${API_URL}/sales/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete sale");
      await fetchSales();
      await fetchReports();
      showToast("Sale record deleted");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  /* =========================
     FOLLOW-UP HANDLERS
  ========================= */

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFollowUpId ? `${API_URL}/followups/${editingFollowUpId}` : `${API_URL}/followups`;
      const method = editingFollowUpId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: followUpForm.customerId ? Number(followUpForm.customerId) : null,
          leadId: followUpForm.leadId ? Number(followUpForm.leadId) : null,
          date: followUpForm.date,
          note: followUpForm.note,
          status: followUpForm.status,
        }),
      });

      if (!res.ok) throw new Error("Failed to save follow-up");
      await fetchFollowUps();
      showToast("Follow-up scheduled!");
      setFollowUpForm({ customerId: "", leadId: "", date: "", note: "", status: "Pending" });
      setEditingFollowUpId(null);
      setShowFollowUpForm(false);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const toggleFollowUpStatus = async (followUp) => {
    try {
      const res = await fetch(`${API_URL}/followups/${followUp.id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to toggle status");
      await fetchFollowUps();
      showToast(`Follow-up marked as ${followUp.status === "Completed" ? "Pending" : "Completed"}`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const deleteFollowUp = async (id) => {
    if (!window.confirm("Delete this follow-up?")) return;
    try {
      const res = await fetch(`${API_URL}/followups/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete follow-up");
      await fetchFollowUps();
      showToast("Follow-up deleted");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  /* =========================
     EMPLOYEE HANDLERS
  ========================= */

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEmployeeId ? `${API_URL}/employees/${editingEmployeeId}` : `${API_URL}/employees`;
      const method = editingEmployeeId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: employeeForm.name,
          email: employeeForm.email,
          phone: employeeForm.phone,
          role: employeeForm.role,
          department: employeeForm.department,
          salary: employeeForm.salary ? Number(employeeForm.salary) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save employee");
      await fetchEmployees();
      showToast(editingEmployeeId ? "Employee updated!" : "Employee added!");
      setEmployeeForm({ name: "", email: "", phone: "", role: "", department: "Sales", salary: "" });
      setEditingEmployeeId(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const editEmployee = (e) => {
    setEditingEmployeeId(e.id);
    setEmployeeForm({
      name: e.name || "",
      email: e.email || "",
      phone: e.phone || "",
      role: e.role || "",
      department: e.department || "Sales",
      salary: e.salary || "",
    });
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Remove this employee?")) return;
    try {
      const res = await fetch(`${API_URL}/employees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove employee");
      await fetchEmployees();
      showToast("Employee record removed");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  /* =========================
     SETTINGS HANDLERS
  ========================= */

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to update settings");
      showToast("Business settings saved successfully!");
      if (data.settings) setSettings(data.settings);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  /* =========================
     CALCULATED & FILTERED DATA
  ========================= */

  const filteredCustomers = customers.filter((c) => {
    const s = customerSearch.toLowerCase();
    const matchSearch =
      (c.name || "").toLowerCase().includes(s) ||
      (c.company || "").toLowerCase().includes(s) ||
      (c.email || "").toLowerCase().includes(s) ||
      (c.phone || "").toLowerCase().includes(s);
    const matchStatus = customerStatusFilter === "All" || c.status === customerStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredLeads = leads.filter((l) => {
    const s = leadSearch.toLowerCase();
    const matchSearch =
      (l.name || "").toLowerCase().includes(s) ||
      (l.email || "").toLowerCase().includes(s) ||
      (l.source || "").toLowerCase().includes(s);
    const matchStatus = leadStatusFilter === "All" || l.status === leadStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredSales = sales.filter((s) => {
    const q = saleSearch.toLowerCase();
    return (
      (s.productName || "").toLowerCase().includes(q) ||
      (s.customer?.name || "").toLowerCase().includes(q) ||
      (s.status || "").toLowerCase().includes(q)
    );
  });

  const filteredEmployees = employees.filter((e) => {
    const s = employeeSearch.toLowerCase();
    return (
      (e.name || "").toLowerCase().includes(s) ||
      (e.email || "").toLowerCase().includes(s) ||
      (e.role || "").toLowerCase().includes(s) ||
      (e.department || "").toLowerCase().includes(s)
    );
  });

  const totalSalesAmount = sales.reduce((acc, s) => acc + (s.status === "Completed" ? Number(s.amount || 0) : 0), 0);
  const pendingFollowUps = followUps.filter((f) => f.status !== "Completed");
  const recentSales = [...sales].sort((a, b) => new Date(b.saleDate || b.createdAt) - new Date(a.saleDate || a.createdAt)).slice(0, 5);

  const curr = settings.currency || "₹";

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>{toast.type === "success" ? "✓" : "⚠️"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="crm-card">
        <h1>{pageTitle[activePage] || activePage}</h1>
        <p className="subtitle">{settings.businessName} • Production-Grade CRM</p>

        {/* =========================================================
            DASHBOARD VIEW
        ========================================================= */}
        {activePage === "Dashboard" && (
          <div className="dashboard-page">
            <div className="dashboard-summary">
              <div className="summary-card">
                <h3>Total Customers</h3>
                <p className="summary-number">{customers.length}</p>
                <span className="summary-subtext">Active Directory</span>
              </div>

              <div className="summary-card">
                <h3>Pipeline Leads</h3>
                <p className="summary-number">{leads.length}</p>
                <span className="summary-subtext">
                  {leads.filter((l) => l.status === "Qualified").length} Qualified
                </span>
              </div>

              <div className="summary-card">
                <h3>Total Revenue</h3>
                <p className="summary-number">
                  {curr}
                  {totalSalesAmount.toLocaleString()}
                </p>
                <span className="summary-subtext">Completed Orders</span>
              </div>

              <div className="summary-card">
                <h3>Pending Follow-ups</h3>
                <p className="summary-number">{pendingFollowUps.length}</p>
                <span className="summary-subtext">Action required</span>
              </div>

              <div className="summary-card">
                <h3>Total Employees</h3>
                <p className="summary-number">{employees.length}</p>
                <span className="summary-subtext">Team Directory</span>
              </div>

              <div className="summary-card">
                <h3>Conversion Rate</h3>
                <p className="summary-number">{reportsData?.kpis?.conversionRate || "12.5%"}</p>
                <span className="summary-subtext">Lead to Customer</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <button onClick={() => setActivePage("Customers")}>+ Add Customer</button>
                <button onClick={() => setActivePage("Leads")}>+ Add Lead</button>
                <button onClick={() => setActivePage("Sales")}>+ Record Sale</button>
                <button onClick={() => setActivePage("Follow-Ups")}>+ Schedule Follow-up</button>
                <button onClick={() => handleExport("sales")}>📥 Export Sales CSV</button>
              </div>
            </div>

            {/* Recent Sales & Follow-ups Grid */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Recent Sales</h3>
                {recentSales.length === 0 ? (
                  <p className="empty-message">No sales recorded yet.</p>
                ) : (
                  <ul className="customer-list">
                    {recentSales.map((s) => (
                      <li key={s.id} className="customer-item" style={{ marginBottom: "10px" }}>
                        <div>
                          <strong>{s.productName}</strong>
                          <div style={{ fontSize: "13px", color: "#64748b" }}>
                            {s.customer ? s.customer.name : "Direct Sale"} • {s.paymentMethod || "Card"}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontWeight: 700, color: "#166534" }}>
                            {curr}
                            {Number(s.amount).toLocaleString()}
                          </span>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>{s.status}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="chart-card">
                <h3>Pending Reminders</h3>
                {pendingFollowUps.length === 0 ? (
                  <p className="empty-message">No pending follow-ups!</p>
                ) : (
                  <ul className="customer-list">
                    {pendingFollowUps.slice(0, 4).map((f) => (
                      <li key={f.id} className="customer-item" style={{ marginBottom: "10px" }}>
                        <div>
                          <strong>{f.note}</strong>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            📅 {new Date(f.date).toLocaleDateString()}
                          </div>
                        </div>
                        <button className="convert-btn" onClick={() => toggleFollowUpStatus(f)}>
                          ✓ Done
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            CUSTOMERS VIEW
        ========================================================= */}
        {activePage === "Customers" && (
          <div>
            <div className="action-bar">
              <div style={{ display: "flex", gap: "10px", flex: 1, maxWidth: "600px" }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search customer by name, email, company..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                <select
                  value={customerStatusFilter}
                  onChange={(e) => setCustomerStatusFilter(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Potential">Potential</option>
                </select>
              </div>

              <button className="export-btn" onClick={() => handleExport("customers")}>
                📥 Export Customers CSV
              </button>
            </div>

            {/* Form */}
            <div className="customer-form-section">
              <h2 className="form-section-title">
                {editingCustomerId ? "Edit Customer" : "Add New Customer"}
              </h2>
              <form className="customer-form" onSubmit={handleCustomerSubmit}>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={customerForm.company}
                  onChange={(e) => setCustomerForm({ ...customerForm, company: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Office Address"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                />
                <select
                  value={customerForm.status}
                  onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Potential">Potential</option>
                </select>

                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingCustomerId ? "Update Customer" : "Add Customer"}
                </button>

                {editingCustomerId && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setEditingCustomerId(null);
                      setCustomerForm({ name: "", email: "", phone: "", company: "", address: "", status: "Active" });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* List */}
            <div className="customers-section">
              <h2>Customer Directory ({filteredCustomers.length})</h2>
              {filteredCustomers.length === 0 ? (
                <p className="empty-message">No matching customers found.</p>
              ) : (
                <ul className="customer-list">
                  {filteredCustomers.map((c) => (
                    <li className="customer-item" key={c.id}>
                      <div className="customer-main-info">
                        <div className="customer-name">{c.name}</div>
                        <div className="customer-info">🏢 {c.company || "Independent"}</div>
                        <div className="customer-info">📧 {c.email || "No email"}</div>
                        <div className="customer-info">📞 {c.phone || "No phone"}</div>
                        <div className="customer-info">📍 {c.address || "N/A"}</div>
                        <div className="customer-status">
                          <span className={`status-badge ${(c.status || "active").toLowerCase()}`}>
                            {c.status || "Active"}
                          </span>
                        </div>
                      </div>

                      <div className="customer-actions">
                        <button className="edit-button" onClick={() => editCustomer(c)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => deleteCustomer(c.id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            LEADS VIEW
        ========================================================= */}
        {activePage === "Leads" && (
          <div>
            <div className="action-bar">
              <div style={{ display: "flex", gap: "10px", flex: 1, maxWidth: "600px" }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search leads by name, email, or source..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                />
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  <option value="All">All Stages</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <button className="export-btn" onClick={() => handleExport("leads")}>
                📥 Export Leads CSV
              </button>
            </div>

            {/* Form */}
            <div className="lead-form-section">
              <h2>{editingLeadId ? "Edit Lead" : "Capture New Lead"}</h2>
              <form className="lead-form" onSubmit={handleLeadSubmit}>
                <input
                  type="text"
                  placeholder="Lead Name *"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Lead Email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                />
                <select
                  value={leadForm.source}
                  onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                >
                  <option value="Website">Website</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Conference">Conference</option>
                  <option value="Google Search">Google Search</option>
                </select>
                <select
                  value={leadForm.status}
                  onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>

                <button type="submit">{editingLeadId ? "Update Lead" : "Save Lead"}</button>

                {editingLeadId && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setEditingLeadId(null);
                      setLeadForm({ name: "", email: "", phone: "", source: "Website", notes: "", status: "New" });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* List */}
            <div className="leads-section">
              <h2>Sales Pipeline ({filteredLeads.length})</h2>
              {filteredLeads.length === 0 ? (
                <p className="empty-message">No leads found in pipeline.</p>
              ) : (
                <ul className="customer-list">
                  {filteredLeads.map((l) => (
                    <li className="customer-item" key={l.id}>
                      <div className="customer-main-info">
                        <div className="customer-name">{l.name}</div>
                        <div className="customer-info">📧 {l.email || "No email"}</div>
                        <div className="customer-info">📞 {l.phone || "No phone"}</div>
                        <div className="customer-info">🌐 Source: {l.source || "Website"}</div>
                        <div className="customer-status">
                          <span className={`status-badge ${(l.status || "new").toLowerCase()}`}>
                            {l.status || "New"}
                          </span>
                        </div>
                      </div>

                      <div className="customer-actions" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {l.status !== "Converted" && (
                          <button className="convert-btn" onClick={() => convertLeadToCustomer(l)}>
                            ⚡ Convert to Customer
                          </button>
                        )}
                        <button className="edit-button" onClick={() => editLead(l)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => deleteLead(l.id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            SALES VIEW
        ========================================================= */}
        {activePage === "Sales" && (
          <div>
            <div className="action-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search sales by product, customer, or status..."
                value={saleSearch}
                onChange={(e) => setSaleSearch(e.target.value)}
                style={{ maxWidth: "450px" }}
              />

              <button className="export-btn" onClick={() => handleExport("sales")}>
                📥 Export Sales CSV
              </button>
            </div>

            {/* Form */}
            <div className="sales-form-section">
              <h2>{editingSaleId ? "Edit Sale Record" : "Record New Sale"}</h2>
              <form className="sales-form" onSubmit={handleSaleSubmit}>
                <select
                  value={saleForm.customerId}
                  onChange={(e) => setSaleForm({ ...saleForm, customerId: e.target.value })}
                >
                  <option value="">-- Link to Customer (Optional) --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ""}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Product / Service Name *"
                  value={saleForm.productName}
                  onChange={(e) => setSaleForm({ ...saleForm, productName: e.target.value })}
                  required
                />

                <input
                  type="number"
                  placeholder={`Amount (${curr}) *`}
                  value={saleForm.amount}
                  onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                  required
                />

                <select
                  value={saleForm.paymentMethod}
                  onChange={(e) => setSaleForm({ ...saleForm, paymentMethod: e.target.value })}
                >
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                </select>

                <select
                  value={saleForm.status}
                  onChange={(e) => setSaleForm({ ...saleForm, status: e.target.value })}
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button type="submit">{editingSaleId ? "Update Sale" : "Save Sale"}</button>

                {editingSaleId && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setEditingSaleId(null);
                      setSaleForm({ customerId: "", productName: "", amount: "", status: "Completed", paymentMethod: "Card" });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* List */}
            <div className="sales-section">
              <h2>Sales Transaction Log ({filteredSales.length})</h2>
              {filteredSales.length === 0 ? (
                <p className="empty-message">No sales found.</p>
              ) : (
                <ul className="customer-list">
                  {filteredSales.map((s) => (
                    <li className="customer-item" key={s.id}>
                      <div className="customer-main-info">
                        <div className="customer-name">{s.productName}</div>
                        <div className="customer-info">
                          👤 Customer:{" "}
                          {s.customer ? (
                            <span className="customer-pill">{s.customer.name}</span>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>Direct / Walk-in</span>
                          )}
                        </div>
                        <div className="customer-info">
                          💳 Method: <strong>{s.paymentMethod || "Card"}</strong>
                        </div>
                        <div className="customer-info" style={{ fontWeight: 700, color: "#0f766e" }}>
                          💰 {curr}
                          {Number(s.amount).toLocaleString()}
                        </div>
                        <div className="customer-status">
                          <span className={`status-badge ${(s.status || "completed").toLowerCase()}`}>
                            {s.status}
                          </span>
                        </div>
                      </div>

                      <div className="customer-actions">
                        <button className="edit-button" onClick={() => editSale(s)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => deleteSale(s.id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            FOLLOW-UPS VIEW
        ========================================================= */}
        {(activePage === "Follow-Ups" || activePage === "FollowUps") && (
          <div>
            <div className="followups-header">
              <h2>Scheduled Reminders & Follow-ups</h2>
              <button onClick={() => setShowFollowUpForm(!showFollowUpForm)}>
                {showFollowUpForm ? "Close Form" : "+ Schedule Follow-up"}
              </button>
            </div>

            {showFollowUpForm && (
              <div className="followup-form-section">
                <h2>{editingFollowUpId ? "Edit Follow-up" : "Schedule New Follow-up"}</h2>
                <form className="customer-form" onSubmit={handleFollowUpSubmit}>
                  <select
                    value={followUpForm.customerId}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, customerId: e.target.value })}
                  >
                    <option value="">-- Link to Customer (Optional) --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        Customer: {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={followUpForm.leadId}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, leadId: e.target.value })}
                  >
                    <option value="">-- Link to Lead (Optional) --</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        Lead: {l.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="datetime-local"
                    value={followUpForm.date}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, date: e.target.value })}
                    required
                  />

                  <input
                    type="text"
                    placeholder="Reminder Note / Agenda *"
                    value={followUpForm.note}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, note: e.target.value })}
                    required
                  />

                  <select
                    value={followUpForm.status}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button type="submit">{editingFollowUpId ? "Update Follow-up" : "Save Follow-up"}</button>
                  {editingFollowUpId && (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setEditingFollowUpId(null);
                        setShowFollowUpForm(false);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            )}

            <div className="followups-section">
              <ul className="customer-list">
                {followUps.map((f) => (
                  <li className="customer-item" key={f.id}>
                    <div className="customer-main-info">
                      <div className="customer-name">{f.note}</div>
                      <div className="customer-info">
                        📅 Due: <strong>{new Date(f.date).toLocaleString()}</strong>
                      </div>
                      <div className="customer-info">
                        👤 Linked:{" "}
                        {f.customer ? (
                          <span className="customer-pill">Customer: {f.customer.name}</span>
                        ) : f.lead ? (
                          <span className="customer-pill" style={{ background: "#fef3c7", color: "#92400e" }}>
                            Lead: {f.lead.name}
                          </span>
                        ) : (
                          "General"
                        )}
                      </div>
                      <div className="customer-status">
                        <span className={`status-badge ${(f.status || "pending").toLowerCase()}`}>
                          {f.status}
                        </span>
                      </div>
                    </div>

                    <div className="customer-actions">
                      <button className="convert-btn" onClick={() => toggleFollowUpStatus(f)}>
                        {f.status === "Completed" ? "↺ Mark Pending" : "✓ Mark Done"}
                      </button>
                      <button className="delete-button" onClick={() => deleteFollowUp(f.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* =========================================================
            REPORTS & ANALYTICS VIEW
        ========================================================= */}
        {activePage === "Reports" && (
          <div className="reports-page">
            <div className="dashboard-summary">
              <div className="summary-card">
                <h3>Total Revenue</h3>
                <p className="summary-number">
                  {curr}
                  {totalSalesAmount.toLocaleString()}
                </p>
                <span className="summary-subtext">All Completed Orders</span>
              </div>
              <div className="summary-card">
                <h3>Avg Deal Size</h3>
                <p className="summary-number">
                  {curr}
                  {(reportsData?.kpis?.avgDealSize || 0).toLocaleString()}
                </p>
                <span className="summary-subtext">Per Transaction</span>
              </div>
              <div className="summary-card">
                <h3>Lead Conversion</h3>
                <p className="summary-number">{reportsData?.kpis?.conversionRate || "12.5%"}</p>
                <span className="summary-subtext">Pipeline Efficiency</span>
              </div>
            </div>

            {/* SVG Visual Bar Chart for Monthly Revenue */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Monthly Revenue Trend (Last 6 Months)</h3>
                {reportsData?.monthlyRevenue ? (
                  <div style={{ padding: "10px 0" }}>
                    <svg className="bar-chart-svg" viewBox="0 0 500 200">
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="160" x2="480" y2="160" stroke="#cbd5e1" strokeWidth="2" />

                      {reportsData.monthlyRevenue.map((m, idx) => {
                        const maxRev = 80000;
                        const barHeight = Math.max(10, Math.min(130, (m.revenue / maxRev) * 130));
                        const x = 60 + idx * 70;
                        const y = 160 - barHeight;
                        return (
                          <g key={m.month}>
                            <rect
                              x={x}
                              y={y}
                              width="40"
                              height={barHeight}
                              fill="#2563eb"
                              rx="4"
                              style={{ transition: "all 0.3s ease" }}
                            />
                            <text x={x + 20} y={y - 8} fontSize="11" fill="#0f172a" textAnchor="middle" fontWeight="600">
                              {curr}
                              {Math.round(m.revenue / 1000)}k
                            </text>
                            <text x={x + 20} y="180" fontSize="11" fill="#64748b" textAnchor="middle">
                              {m.month.split(" ")[0]}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                ) : (
                  <p>Loading analytics...</p>
                )}
              </div>

              {/* Lead Pipeline Funnel */}
              <div className="chart-card">
                <h3>Lead Pipeline Breakdown</h3>
                {reportsData?.leadStatusCounts ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
                    {Object.entries(reportsData.leadStatusCounts).map(([status, count]) => {
                      const total = leads.length || 1;
                      const pct = Math.round((count / total) * 100);
                      const colors = {
                        New: "#60a5fa",
                        Contacted: "#f59e0b",
                        Qualified: "#8b5cf6",
                        Converted: "#10b981",
                        Lost: "#ef4444",
                      };
                      return (
                        <div key={status}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                            <span><strong>{status}</strong> ({count})</span>
                            <span style={{ color: "#64748b" }}>{pct}%</span>
                          </div>
                          <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                            <div
                              style={{
                                width: `${pct}%`,
                                height: "100%",
                                background: colors[status] || "#2563eb",
                                borderRadius: "4px",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Top Customers Table */}
            {reportsData?.topCustomers && reportsData.topCustomers.length > 0 && (
              <div className="chart-card" style={{ marginTop: "25px" }}>
                <h3>Top Customers by Lifetime Value</h3>
                <ul className="customer-list">
                  {reportsData.topCustomers.map((c, i) => (
                    <li key={c.name} className="customer-item" style={{ marginBottom: "8px" }}>
                      <div>
                        <strong>#{i + 1} {c.name}</strong>
                      </div>
                      <div style={{ fontWeight: 700, color: "#166534" }}>
                        {curr}
                        {c.revenue.toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            EMPLOYEES VIEW
        ========================================================= */}
        {activePage === "Employees" && (
          <div>
            <div className="action-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search employees by name, email, or role..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                style={{ maxWidth: "450px" }}
              />
            </div>

            {/* Form */}
            <div className="employee-form-section">
              <h2>{editingEmployeeId ? "Edit Employee" : "Add Team Member"}</h2>
              <form className="customer-form" onSubmit={handleEmployeeSubmit}>
                <input
                  type="text"
                  placeholder="Employee Name *"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Official Email *"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Role / Title *"
                  value={employeeForm.role}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
                  required
                />
                <select
                  value={employeeForm.department}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                >
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Support">Support</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Management">Management</option>
                </select>
                <input
                  type="number"
                  placeholder={`Salary (${curr}/mo)`}
                  value={employeeForm.salary}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
                />

                <button type="submit">{editingEmployeeId ? "Update Employee" : "Save Employee"}</button>

                {editingEmployeeId && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setEditingEmployeeId(null);
                      setEmployeeForm({ name: "", email: "", phone: "", role: "", department: "Sales", salary: "" });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* List */}
            <div className="employees-section">
              <h2>Team Directory ({filteredEmployees.length})</h2>
              <ul className="customer-list">
                {filteredEmployees.map((e) => (
                  <li className="customer-item" key={e.id}>
                    <div className="customer-main-info">
                      <div className="customer-name">{e.name}</div>
                      <div className="customer-info">💼 {e.role} ({e.department || "Sales"})</div>
                      <div className="customer-info">📧 {e.email}</div>
                      <div className="customer-info">📞 {e.phone || "No phone"}</div>
                      {e.salary && (
                        <div className="customer-info">
                          💰 {curr}
                          {Number(e.salary).toLocaleString()}/mo
                        </div>
                      )}
                    </div>

                    <div className="customer-actions">
                      <button className="edit-button" onClick={() => editEmployee(e)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => deleteEmployee(e.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* =========================================================
            SETTINGS VIEW
        ========================================================= */}
        {activePage === "Settings" && (
          <div className="settings-page">
            <div className="chart-card">
              <h3>CRM Organization Settings</h3>
              <p className="subtitle" style={{ marginBottom: "20px" }}>
                Update your business identity and preferences. Changes persist immediately to the database.
              </p>

              <form onSubmit={handleSettingsSubmit} className="settings-grid">
                <div className="settings-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    value={settings.businessName || ""}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    required
                  />
                </div>

                <div className="settings-group">
                  <label>Official Email</label>
                  <input
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>

                <div className="settings-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    value={settings.phone || ""}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>

                <div className="settings-group">
                  <label>Currency Symbol</label>
                  <select
                    value={settings.currency || "₹"}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  >
                    <option value="₹">₹ (INR - Rupee)</option>
                    <option value="$">$ (USD - Dollar)</option>
                    <option value="€">€ (EUR - Euro)</option>
                    <option value="£">£ (GBP - Pound)</option>
                  </select>
                </div>

                <div className="settings-group" style={{ gridColumn: "span 2" }}>
                  <label>Office Address</label>
                  <input
                    type="text"
                    value={settings.address || ""}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>

                <div className="settings-group">
                  <label>Default Tax Rate (%)</label>
                  <input
                    type="number"
                    value={settings.taxRate || 0}
                    onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                  />
                </div>

                <button type="submit" className="settings-save-btn">
                  💾 Save Business Settings
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;