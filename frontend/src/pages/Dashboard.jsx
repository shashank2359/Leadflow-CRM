import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {
    const token = localStorage.getItem("token");

if (!token) {
  return <Navigate to="/login" />;
}
  const [stats, setStats] = useState({
    total: 0,
    newLeads: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  });
  const chartData = {
  labels: [
    "New",
    "Contacted",
    "Qualified",
    "Converted",
    "Lost",
  ],
  datasets: [
    {
      data: [
        stats.newLeads,
        stats.contacted,
        stats.qualified,
        stats.converted,
        stats.lost,
      ],
      backgroundColor: [
        "#3B82F6", 
        "#F59E0B", 
        "#10B981", 
        "#8B5CF6", 
        "#EF4444", 
      ],
      borderWidth: 2,
    },
  ],
};
const options = {
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

  const [leads, setLeads] = useState([]);
  const csvData = leads.map((lead) => ({
  Name: lead.name,
  Email: lead.email,
  Phone: lead.phone,
  Company: lead.company,
  Status: lead.status,
  Notes: lead.notes,
  CreatedDate: new Date(lead.createdAt).toLocaleDateString(),}));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "New",
  notes: "",
});

const fetchData = async () => {
    try {
      // Fetch stats
      const statsRes = await api.get("/leads/stats");
      setStats(statsRes.data);

      // Fetch leads
      const leadsRes = await api.get(`/leads?page=${page}&limit=5`);
      setLeads(leadsRes.data.leads);
        setPages(leadsRes.data.pages);

    } catch (error) {
      console.log("Error:", error);
    }
  };

 useEffect(() => {fetchData();}, [page]);

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const createLead = async (e) => {
  e.preventDefault();

  try {
    if (editingId) {
      await api.put(
        `/leads/${editingId}`,
        formData
      );

      setEditingId(null);

      alert("Lead Updated Successfully");

      fetchData();
    } else {
      await api.post(
        "/leads",
        formData
      );

      alert("Lead Added Successfully");

      fetchData();
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "New",
      notes: "",
    });

  } catch (error) {
    console.log(error);
    alert("Operation Failed");
  }
};

const startEdit = (lead) => {
  setEditingId(lead._id);

  setFormData({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    status: lead.status,
    notes: lead.notes || "",
  });
};

const deleteLead = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this lead?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/leads/${id}`);

    fetchData();

    alert("Lead Deleted Successfully");
  } catch (error) {
    console.log(error);
    alert("Failed to delete lead");
  }
};

const updateStatus = async (id) => {
  try {
    await api.put(`/leads/${id}`, {
      status: "Contacted",
    });

    fetchData();

    alert("Status Updated");
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 shadow flex justify-between items-center">
  <h1 className="text-2xl font-bold">
    LeadFlow CRM
  </h1>

  <button
    onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }}
    className="bg-red-500 px-4 py-2 rounded"
  >
    Logout
  </button>
</nav>

      <div className="p-6">
        {/* Dashboard Title */}
        <h2 className="text-xl font-semibold mb-6">
          Dashboard
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Total Leads</h3>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">New Leads</h3>
            <p className="text-3xl font-bold">{stats.newLeads}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Contacted</h3>
            <p className="text-3xl font-bold">{stats.contacted}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Qualified</h3>
            <p className="text-3xl font-bold">{stats.qualified}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Converted</h3>
            <p className="text-3xl font-bold">{stats.converted}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500">Lost</h3>
            <p className="text-3xl font-bold">{stats.lost}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mt-6">
  <h2 className="text-xl font-semibold mb-4">
    Lead Analytics
  </h2>

  <div className="max-w-md mx-auto">
    <Pie data={chartData} options={options} />
  </div>
</div>

        <div className="mt-8 mb-4">
  <div className="bg-white p-4 rounded shadow mb-6">
  <h2 className="text-xl font-semibold mb-4">
  {editingId ? "Edit Lead" : "Add Lead"}
</h2>

  <form onSubmit={createLead}>
    <div className="grid grid-cols-2 gap-4">

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <input
        type="text"
        name="company"
        placeholder="Company"
        value={formData.company}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option>New</option>
        <option>Contacted</option>
        <option>Qualified</option>
        <option>Converted</option>
        <option>Lost</option>
      </select>

      <input
        type="text"
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        className="p-2 border rounded"
      />

    </div>

    <button
  type="submit"
  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
  {editingId ? "Update Lead" : "Add Lead"}
    </button>
    {editingId && (
  <button
    type="button"
    onClick={() => {
      setEditingId(null);

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "New",
        notes: "",
      });
    }}
    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"> Cancel </button>)}

  </form>
</div>

  <div className="flex gap-4">
  <input
    type="text"
    placeholder="Search by name, email or company..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full p-3 border rounded-lg bg-white"/>

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="p-3 border rounded-lg bg-white">
    <option value="">All Statuses</option>
    <option value="New">New</option>
    <option value="Contacted">Contacted</option>
    <option value="Qualified">Qualified</option>
    <option value="Converted">Converted</option>
    <option value="Lost">Lost</option>
  </select>
</div>
</div>
        
        {/* Leads Table */}
        <div className="mt-8 bg-white rounded shadow p-4">
         <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">
    Leads
  </h2>

  <CSVLink
    data={csvData}
    filename="leadflow-leads.csv"
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Export CSV
  </CSVLink>
</div>

          <table className="w-full">
            <thead>
  <tr className="border-b">
    <th className="text-left p-2">Name</th>
    <th className="text-left p-2">Email</th>
    <th className="text-left p-2">Company</th>
    <th className="text-left p-2">Status</th>
    <th className="text-left p-2">Created Date</th>
    <th className="text-left p-2">Actions</th>
  </tr>
</thead>

            <tbody>
              {leads
  .filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .map((lead) => (
                <tr key={lead._id} className="border-b">
                  <td className="p-2">{lead.name}</td>
                  <td className="p-2">{lead.email}</td>
                  <td className="p-2">{lead.company}</td>
                  <td className="p-2">
  <span
    className={`px-2 py-1 rounded text-white text-sm ${
      lead.status === "New"
        ? "bg-blue-500"
        : lead.status === "Contacted"
        ? "bg-yellow-500"
        : lead.status === "Qualified"
        ? "bg-green-500"
        : lead.status === "Converted"
        ? "bg-purple-500"
        : "bg-red-500"}`}>
    {lead.status}
  </span>
</td>
                  <td className="p-2">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
  <button
    onClick={() => updateStatus(lead._id)}
    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
    Contacted
  </button>

  <button
  onClick={() => startEdit(lead)}
  className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
  Edit
  </button>

  <button
    onClick={() => deleteLead(lead._id)}
    className="bg-red-500 text-white px-3 py-1 rounded">
    Delete
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center gap-4 mt-4">

  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="bg-gray-300 px-4 py-2 rounded"
  >
    Previous
  </button>

  <span className="font-bold">
    Page {page} of {pages}
  </span>

  <button
    disabled={page === pages}
    onClick={() => setPage(page + 1)}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Next
  </button>

</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;