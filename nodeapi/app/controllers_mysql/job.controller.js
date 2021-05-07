const mysql = require('mysql');
const connection = require("./mysql.controller");


exports.getEmployers = (req, res) => {
  let limit = req.query.limit ? "LIMIT " + req.query.limit : "";

  let query = `SELECT e.*, c.*, s.*, GROUP_CONCAT(j.JobId) Jobs, COUNT(j.JobId) JobCount
                  FROM employer e
                  JOIN city c ON e.CityId = c.CityId
                  JOIN state s ON c.StateId = s.StateId
                  JOIN job j ON e.EmployerId = j.EmployerId
                  GROUP BY e.EmployerId, c.CityId
                  ORDER BY JobCount DESC, e.EmployerName ${limit}`;

  connection.query(query, function (obj) {
    let finalResponse = {
      success: true,
      message: null,
      data: obj.response
    };
    return res.status(200).send(finalResponse);
  });

}

exports.getEmployerProfile = (req, res) => {
  let id = req.params.id;
  let query = `SELECT * FROM employer e
                JOIN city c ON e.CityId = c.CityId
                JOIN state s ON c.StateId = s.StateId AND e.EmployerId =  ${id};
                
                SELECT * from job WHERE EmployerId = ${id};`;

  connection.query(query, function (obj) {
    let employer = obj.response[0][0];

    employer.Jobs = obj.response[1];


    let finalResponse = {
      success: true,
      message: null,
      data: employer
    };

    return res.status(200).send(finalResponse);
  });

}

exports.getJobDetails = (req, res) => {
  let jobId = req.params.id;
  let query = `SELECT * FROM job j
                JOIN employer e ON e.EmployerId = j.EmployerId
                JOIN city c ON e.CityId = c.CityId
                JOIN state s ON c.StateId = s.StateId AND j.JobId = ${jobId}`;

  connection.query(query, function (obj) {
    let job = obj.response[0];
    let finalResponse = {
      success: true,
      message: null,
      data: job
    };

    return res.status(200).send(finalResponse);
  });
}

exports.getCities = (req, res) => {
  let query = `SELECT * FROM city c JOIN state s ON c.StateId = s.StateId`;

  connection.query(query, function (obj) {
    // to be honest, this is not the best approach
    // because of how many queries are being run here
    // we should fetch all the data at once (by a join) and process them
    // This would work for now, though

    let content = obj.response;

    content.forEach(c => {
      let empQuery = `SELECT * from employer WHERE CityId=${c.CityId}`;

      connection.query(empQuery, function (objEmp) {
        c.Employers = objEmp.response;
      })
    })

    finalResponse = {
      success: true,
      message: null,
      data: content
    };

    return res.status(200).send(finalResponse);
  })
}

exports.getLocationSuggestions = (req, res) => {
  let keyword = req.params.keyword;

  let query = `SELECT * FROM city c
                    JOIN state s ON s.StateId = c.StateId
                    WHERE c.CityName LIKE '%${keyword}%';
                    
                    SELECT * FROM state s
                    WHERE s.StateName LIKE '%${keyword}%'
                    OR s.StateCode LIKE '%${keyword}%';`;

  connection.query(query, function (obj) {
    let cities = obj.response[0];

    let states = obj.response[1];

    if (!keyword) {
      cities = [];
      states = [];
    }

    finalResponse = {
      success: true,
      message: null,
      data: { cities, states }
    };

    return res.status(200).send(finalResponse);
  })

}

exports.getSearchResults = (req, res) => {
  let content = req.query;

  let id_field = content.lt[0].toLowerCase() + "." + content.lt + "Id";
  let id_value = content.lid;
  let text = content.t;
  andClause = !text ? `AND j.JobDescription LIKE '%${text}%'` : ``;
  if (!id_value || id_value == 'undefined') {
    id_field = 1;
    id_value = 1;
  }

  let query = `SELECT j.*, e.EmployerName, c.CityName, s.StateName, s.StateCode
              FROM job j
              JOIN employer e ON j.EmployerId = e.EmployerId
              JOIN city c ON j.CityId = c.CityId
              JOIN state s ON c.StateId = s.StateId
              WHERE ${id_field} = '${id_value}' ${andClause}`;

  connection.query(query, function (obj) {

    let finalResponse = {
      success: true,
      message: null,
      data: obj.response
    };

    res.status(200).send(finalResponse);

  });
}

