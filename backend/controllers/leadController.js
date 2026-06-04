const Lead = require("../models/Lead");

const createLead = async (req, res) => {
  try {

    console.log(req.body);

    const lead = await Lead.create(req.body);

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getLeads = async (req, res) => {
  try {

    const {
      q,
      status,
      sort,
      page = 1,
      limit = 5
    } = req.query;

    let query = {};

    // Search
    if (q) {
      query.$or = [
        {
          name: {
            $regex: q,
            $options: "i"
          }
        },
        {
          email: {
            $regex: q,
            $options: "i"
          }
        },
        {
          company: {
            $regex: q,
            $options: "i"
          }
        }
      ];
    }

    // Filter
    if (status) {
      query.status = status;
    }

    // Sort
    let sortOption = {
      createdAt: -1
    };

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1
      };
    }

    if (sort === "company") {
      sortOption = {
        company: 1
      };
    }

    const total = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      leads
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateLead = async (req, res) => {
  try {


    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
      }
    );

    res.status(200).json(updatedLead);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteLead = async (req, res) => {
  try {

    const deletedLead =
      await Lead.findByIdAndDelete(
        req.params.id
      );

    if (!deletedLead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      message: "Lead deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });
  }
};

const getLeadStats = async (req, res) => {
  try {

    const total = await Lead.countDocuments();

    const newLeads = await Lead.countDocuments({
      status: "New"
    });

    const contacted = await Lead.countDocuments({
      status: "Contacted"
    });

    const qualified = await Lead.countDocuments({
      status: "Qualified"
    });

    const converted = await Lead.countDocuments({
      status: "Converted"
    });

    const lost = await Lead.countDocuments({
      status: "Lost"
    });

    res.status(200).json({
      total,
      newLeads,
      contacted,
      qualified,
      converted,
      lost
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
 
module.exports = {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getLeadStats,
};