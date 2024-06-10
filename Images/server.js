const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jobApplications', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the schema and model
const applicationSchema = new mongoose.Schema({
  personalInfo: {
    fname: String,
    lname: String,
    tel: String,
    dob: Date,
    gender: String,
    media: String,
  },
  address: {
    street: String,
    apt: String,
    city: String,
    state: String,
    zip: String,
  },
  education: {
    education: String,
    major: String,
    graduation_year: Number,
  },
  workExperience: [{
    company_name: String,
    job_title: String,
    start_date: Date,
    end_date: Date,
    responsibilities: String,
    currently_employed: String,
  }],
  skills: [String],
  availability: {
    start_date: Date,
    preferred_hours: String,
    preferred_location: String,
    work_location: String,
  },
  references: [{
    name: String,
    relationship: String,
    phone_number: String,
    email_address: String,
  }],
  additionalInfo: {
    linkedin_profile: String,
    github_profile: String,
    why_work_here: String,
    resume: String,
    background_check: Boolean,
    job_alerts: Boolean,
    points: Number,
  },
});

const Application = mongoose.model('Application', applicationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle form submission
app.post('/submit-application', upload.single('resume'), (req, res) => {
  const applicationData = {
    personalInfo: {
      fname: req.body.fname,
      lname: req.body.lname,
      tel: req.body.tel,
      dob: req.body.dob,
      gender: req.body.gender,
      media: req.file ? req.file.filename : null,
    },
    address: {
      street: req.body.street,
      apt: req.body.apt,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
    },
    education: {
      education: req.body.education,
      major: req.body.major,
      graduation_year: req.body.graduation_year,
    },
    workExperience: [{
      company_name: req.body.company_name,
      job_title: req.body.job_title,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      responsibilities: req.body.responsibilities,
      currently_employed: req.body.currently_employed,
    }],
    skills: req.body.skills instanceof Array ? req.body.skills : [req.body.skills],
    availability: {
      start_date: req.body.start_date,
      preferred_hours: req.body.preferred_hours,
      preferred_location: req.body.preferred_location,
      work_location: req.body.work_location,
    },
    references: [{
      name: req.body['references[0][name]'],
      relationship: req.body['references[0][relationship]'],
      phone_number: req.body['references[0][phone_number]'],
      email_address: req.body['references[0][email_address]'],
    }, {
      name: req.body['references[1][name]'],
      relationship: req.body['references[1][relationship]'],
      phone_number: req.body['references[1][phone_number]'],
      email_address: req.body['references[1][email_address]'],
    }],
    additionalInfo: {
      linkedin_profile: req.body.linkedin_profile,
      github_profile: req.body.github_profile,
      why_work_here: req.body.why_work_here,
      resume: req.file ? req.file.filename : null,
      background_check: req.body.background_check === 'on',
      job_alerts: req.body.job_alerts === 'on',
      points: req.body.points,
    },
  };

  const application = new Application(applicationData);
  application.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving application');
    } else {
      res.redirect('/thankyou.html');
    }
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
