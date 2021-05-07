const connection = require('./mysql.controller');
const mysql = require('mysql');
const uuid = require('uuid');

// Registration
exports.register = (req, res) => {

    const salt = uuid.v4().toString();

    // Validate request
    if (!req.body.Email) {
        return res.status(400).send({
            message: "Email is required"
        });
    }

    if (!req.body.Password) {
        return res.status(400).send({
            message: "Password is required"
        });
    }

    if (!req.body.PasswordConfirmation) {
        return res.status(400).send({
            message: "Please confirm the password"
        });
    }

    if (req.body.Password != req.body.PasswordConfirmation) {
        return res.status(400).send({
            message: "Passwords do not match"
        });
    }

    let checkQuery = `SELECT UserId from \`user\` WHERE Email=${mysql.escape(req.body.Email)}`;

    console.log(checkQuery);

    connection.query(checkQuery, function (objCheck) {
        console.log(objCheck.response);
        if (objCheck.response && objCheck.response && objCheck.response.length) {
            return res.status(400).send({
                message: `The email ${req.body.Email} has already been used. Please use another email.`
            });
        }

        let query = `INSERT INTO \`user\` 
                (FirstName, LastName, FullName, Gender, Email, Password, Salt)
                VALUES (
                    ${mysql.escape(req.body.FirstName)},
                    ${mysql.escape(req.body.LastName)},
                    ${mysql.escape(req.body.FirstName + ' ' + req.body.LastName)},
                    ${mysql.escape(req.body.Gender)},
                    ${mysql.escape(req.body.Email)},
                    MD5(CONCAT_WS(${mysql.escape(req.body.Password)}, '|', ${mysql.escape(salt)})),
                    ${mysql.escape(salt)}
                )`;

        console.log(query);

        connection.query(query, function (objInsert) {

            let selectQuery = `SELECT * FROM \`user\` u
                            WHERE u.Email = '${req.body.Email}' 
                            AND u.Password = MD5(CONCAT_WS('${req.body.Password}', '|', u.Salt))`;


            connection.query(selectQuery, function (objSelect) {

                return res.status(200).send({
                    success: true,
                    message: null,
                    data: { insertResponse: objInsert.response, userData: objSelect.response[0] }
                });
            });
        });
    })

}

// Logging into the portal
exports.login = (req, res) => {

    // Validate request
    if (!req.body.Email) {
        return res.status(400).send({
            message: "Email is required"
        });
    }

    if (!req.body.Password) {
        return res.status(400).send({
            message: "Password is required"
        });
    }

    let query = `SELECT *
                FROM \`user\` u
                WHERE u.Email = '${req.body.Email}' 
                AND u.Password = MD5(CONCAT_WS('${req.body.Password}', '|', u.Salt))`;

    console.log(query);

    connection.query(query, function (obj) {
        if (obj.response.length) {
            var userInfo = obj.response[0];

            res.status(200).send({
                success: true,
                message: null,
                data: userInfo
            });
        } else
            res.status(400).send({
                success: false,
                message: `Invalid login`,
                data: null
            });
    });


}


exports.list = (req, res) => {

    if (!req.query.OrganizationId) {
        return res.status(400).send({
            message: "Organization Id cannot be empty"
        });
    }

    connection.query(`SELECT *
                        FROM employee e
                        JOIN organization o ON e.OrganizationId = o.OrganizationId AND e.OrganizationId = ${req.query.OrganizationId}                     
                        JOIN department d ON e.DepartmentId = d.DepartmentId
                        JOIN system_role sr ON e.SystemRoleId = sr.SystemRoleId
                        LEFT JOIN employee_profile ep ON e.EmployeeId = ep.EmployeeId
                        ORDER BY e.FullName
                        `, function (obj) {
        if (obj.response.length)
            res.status(200).send({
                success: true,
                message: null,
                data: obj.response
            });
        else
            res.status(400).send({
                success: false,
                message: ``,
                data: null
            });
    });

}


exports.listByProject = (req, res) => {

    if (!req.query.OrganizationId) {
        return res.status(400).send({
            message: "Organization Id cannot be empty"
        });
    }

    if (!req.query.ProjectId) {
        return res.status(400).send({
            message: "Project Id cannot be empty"
        });
    }

    connection.query(`SELECT e.*, o.*
                        FROM employee e
                        JOIN organization o ON e.OrganizationId = o.OrganizationId     
                        JOIN project_employee_map pem ON e.EmployeeId = pem.EmployeeId
                        AND pem.ProjectId = '${req.query.ProjectId}'
                        ORDER BY e.FullName
                        `, function (obj) {
        if (obj.response.length)
            res.status(200).send({
                success: true,
                message: null,
                data: obj.response
            });
        else
            res.status(400).send({
                success: false,
                message: ``,
                data: null
            });
    });
}
// Creating a Employee
exports.crup = (req, res) => {

    console.log(req.body);
    // Validate request

    // from textbox
    if (!req.body.FirstName) {
        return res.status(400).send({
            success: false,
            message: "Employee First name cannot be empty",
            data: null
        });
    }

    // from textbox
    if (!req.body.LastName) {
        return res.status(400).send({
            success: false,
            message: "Employee Last name cannot be empty",
            data: null
        });
    }

    // if (!req.body.EmployeeTypeId) {
    //     return res.status(400).send({
    //         success: false, message: "Employee Type Id cannot be empty", data: null
    //     });
    // }

    // from textbox
    if (!req.body.Email) {
        return res.status(400).send({
            success: false,
            message: "Employee Email cannot be empty",
            data: null
        });
    }

    //from localStorage
    if (!req.body.OrganizationId) {
        return res.status(400).send({
            success: false,
            message: "Organization Id  cannot be empty",
            data: null
        });
    }

    let MiddleName = ``;
    if (req.body.MiddleName) {
        MiddleName = req.body.MiddleName;
    } else {
        MiddleName = "";
    }

    let Gender = ``;
    if (req.body.Gender) {
        Gender = req.body.Gender;
    } else {
        Gender = "";
    }

    let Designation = ``;
    if (req.body.Designation) {
        Designation = req.body.Designation;
    } else {
        Designation = "";
    }

    //from dropdown
    // if (!req.body.DepartmentId) {
    //     return res.status(400).send({
    //         success: false, message: "Department Id  cannot be empty", data: null
    //     });
    // }

    //generate employee code (DEBADEEP)
    let empCodePrefix = ''; // this is left blank for now, organizations should later be able to pick their prefix codes #TODO
    let empCodeQuery = `SELECT CONCAT('${empCodePrefix}', REPLACE(MAX(employee.EmployeeCode),'${empCodePrefix}','') + 1) ECode FROM employee`;
    connection.query(empCodeQuery, function (obj, employeeCode) {
        if (obj.response.length) {
            let employeeCode = obj.response[0].ECode;
            console.log(employeeCode);

            let duplicateQuery = `SELECT Email FROM employee where Email ='${req.body.Email}'${req.body.EmployeeId ? " and EmployeeId <> " + req.body.EmployeeId : ""} `;


            console.log(duplicateQuery);

            connection.query(duplicateQuery, function (obj) {
                if (obj.response.length)
                    res.status(400).send({
                        success: false,
                        message: `The Employee Email "${req.body.Email}" has already been assigned to another Employee in your organization.`,
                        data: null
                    });
            });
            console.log(employeeCode);
            let crupQuery = req.body.EmployeeId ?
                `UPDATE employee set
                             Salutation ='${req.body.Salutation}',
                             FirstName ='${req.body.FirstName}',
                             MiddleName ='${MiddleName}',
                             LastName ='${req.body.LastName}',
                             FullName = CONCAT('${req.body.FirstName}',' ','${MiddleName}',' ','${req.body.LastName}'),
                             Email = '${req.body.Email}',
                             OrganizationId = '${req.body.OrganizationId}',
                             DepartmentId = '${1}',
                             LastUpdatedBy = '${req.body.LastUpdatedBy}'
                             where EmployeeId = ${req.body.EmployeeId}` :
                `INSERT INTO employee (Salutation,FirstName,MiddleName,LastName,FullName,EmployeeCode,Salt,Email,OrganizationId,DepartmentId,CreatedBy)
                            VALUES('${req.body.Salutation}',
                            '${req.body.FirstName}',
                            '${MiddleName}',
                            '${req.body.LastName}',
                            CONCAT('${req.body.FirstName}',' ','${MiddleName}',' ','${req.body.LastName}'),
                            '${req.body.EmployeeCode}',
                            UUID(),
                            '${req.body.Email}',
                            '${req.body.OrganizationId}',
                            '${1}',
                             '${req.body.CreatedBy}')`;

            if (req.body.EmployeeId && req.query.delete) {
                crupQuery = `UPDATE employee set  Deleted ='Y',DeletedBy='${req.body.LastUpdatedBy}',DeletedDateTime=now() where EmployeeId = ${req.body.EmployeeId}`;
                console.log(crupQuery);
            }

            console.log(crupQuery);

            connection.query(crupQuery, function (obj) {

                // assign a default password if a new employee is being added to the system
                if (crupQuery.startsWith('INSERT')) {
                    let passwordQuery = `UPDATE employee SET Password = MD5(CONCAT_WS('1234', '|', Salt)) WHERE EmployeeCode = '${employeeCode}'`;
                    connection.query(passwordQuery, function (objPassword) {
                        console.log(passwordQuery);
                        console.log(objPassword);
                    });
                }
                // assign a supervisor
                let SuperviseeId = obj.response.insertId;

                // Assign a Employee Profile 
                console.log("Gender " + req.body.Gender);
                let employeProfileQuery = req.body.EmployeeId ?
                    `UPDATE employee_profile set 
                                 ${req.body.Gender ? "Gender = '" + req.body.Gender + "'," : ""}
                                 ${req.body.Designation ? "Designation = '" + req.body.Designation + "'," : ""}
                                 Bio = '${req.body.Bio ? req.body.Bio.replace(/'/g, "\\'") : ""}'
                                 Where EmployeeId = ${req.body.EmployeeId}` :
                    `INSERT INTO  employee_profile (EmployeeId,
                                                    Gender,
                                                    ${req.body.Designation ? "Designation," : ""}
                                                    Bio)
                                            VALUES('${SuperviseeId}',
                                            '${Gender}',
                                            ${req.body.Designation ? req.body.Designation + "," : ""}
                                            '${req.body.Bio ? req.body.Bio.replace(/'/g, "\\'") : ""}')`;

                connection.query(employeProfileQuery, function (objProfile) {
                    console.log(employeProfileQuery);
                    console.log(objProfile);
                });

                let deletQuery = req.body.EmployeeId ?
                    `DELETE FROM employee_supervisor_map where  SuperviseeId = ${req.body.EmployeeId}` :
                    `DELETE FROM employee_supervisor_map where  SuperviseeId = ${SuperviseeId}`;

                console.log(deletQuery);
                connection.query(deletQuery, function (obj) {

                    if (!req.body.SupervisorId) {
                        return res.send({
                            success: obj.error == null,
                            message: obj.error || `Success`,
                            data: obj.response
                        });
                    }

                    let query = req.body.EmployeeId ?
                        `INSERT INTO employee_supervisor_map (SupervisorId,SuperviseeId,StartDate,CreatedBy)
                                        VALUES('${req.body.SupervisorId}',
                                        '${req.body.EmployeeId}',
                                        now(),
                                        '${req.body.CreatedBy}')` :
                        `INSERT INTO employee_supervisor_map (SupervisorId,SuperviseeId,StartDate,CreatedBy) 
                                        VALUES('${req.body.SupervisorId}',
                                        '${SuperviseeId}',
                                        now(),
                                        '${req.body.CreatedBy}')`;
                    console.log(query)
                    connection.query(query, function (obj) {

                        res.send({
                            success: obj.error == null,
                            message: obj.error || `Success`,
                            data: obj.response

                        });
                    });
                });

            });
        }
    });

}

// fetch employee Details by employee Id
exports.employeeDetails_By_EmployeeId = (req, res) => {

    var query = `SELECT e.*,esm.SupervisorId,ep.* FROM  employee as e 
                LEFT JOIN employee_supervisor_map as esm
                ON e.EmployeeId = esm.SuperviseeId
                LEFT JOIN employee_profile as ep
                ON e.EmployeeId = ep.EmployeeId where e.EmployeeId = '${req.params.EmployeeId}'`;


    console.log(query);
    connection.query(query, function (obj) {
        res.send({
            success: true,
            message: `Success`,
            data: obj.response
        });
    });
}

exports.profile = (req, res) => {

    if (!req.params.employeeCode) {
        return res.status(400).send({
            success: false,
            message: "Employee Code is required",
            data: null
        });
    }

    let query = `SELECT * FROM employee e 
                    JOIN department d ON e.DepartmentId
                    JOIN system_role sr ON e.SystemRoleId = sr.SystemRoleId
                    LEFT JOIN employee_profile ep ON e.EmployeeId = ep.EmployeeId
                    WHERE e.EmployeeCode = '${req.params.employeeCode}'`;

    connection.query(query, function (obj) {

        if (!obj.response.length) {
            return res.status(204).send({
                success: false,
                message: "No employee found",
                data: null
            });
        }

        let employeeDetails = obj.response[0];
        let empId = employeeDetails.EmployeeId;

        console.log(employeeDetails);
        console.log(empId);

        let projQuery = `SELECT p.ProjectId, p.ProjectName, p.ProjectCode, pr.ProjectRoleName
                        FROM project p 
                        JOIN project_employee_map pem ON p.ProjectId = pem.ProjectId
                        JOIN project_role pr ON pem.ProjectRoleId = pr.ProjectRoleId
                        WHERE pem.EmployeeId = '${empId}'`;

        let projDetails = [];


        connection.query(projQuery, function (objProj) {

            projDetails = objProj.response;

            let systemRoleQuery = `SELECT sr.* FROM employee_system_role_map esrm JOIN system_role sr
                                    ON esrm.SystemRoleId = sr.SystemRoleId
                                    AND esrm.EmployeeId = '${empId}'`;

            let sysRoles = [];


            connection.query(systemRoleQuery, function (objSr) {

                sysRoles = objSr.response;

                res.send({
                    success: obj.error == null,
                    message: obj.error || `Success`,
                    data: {
                        profile: employeeDetails,
                        projects: projDetails,
                        systemRoles: sysRoles
                    }
                });

            });

        });

    });

}



// Reset all passwords (for all users)
exports.updateallpasswords = (req, res) => {
    let query = '';

    for (let i = 0; i < 100; i++) {
        query = `UPDATE employee SET Salt = UUID() WHERE EmployeeId = ${i};
                UPDATE employee SET Password = MD5(CONCAT_WS('1234', '|', Salt)) WHERE EmployeeId = ${i}`;

        connection.query(query, function (obj) {
            console.log(query);
        });
    }

    res.send({
        s: 'success'
    });
}


// Reset all passwords (for all users)
exports.resetpassword = (req, res) => {

    console.log(req.body);

    if (!req.body.Email) {
        return res.status(400).send({
            success: false,
            message: 'Email is required',
            data: null
        })
    }

    if (req.body.Password) {

        if (!req.body.OldPassword) {
            return res.status(400).send({
                success: false,
                message: 'Old Password is required',
                data: null
            })
        }

        let checkPasswordQuery = `SELECT Count(EmployeeId) empCount FROM employee 
                                    WHERE Email = '${req.body.Email}' 
                                    AND Password = MD5(CONCAT_WS('${req.body.Password}', '|', Salt))`;

        let oldPasswordCheckFailed = false;
        connection.query(checkPasswordQuery, function (objCheckPassword) {
            console.log(objCheckPassword);

            if (!objCheckPassword.response[0].empCount) {
                oldPasswordCheckFailed = true;
                return;
            }
        });

        if (oldPasswordCheckFailed) {
            return res.status(400).send({
                success: false,
                message: 'Old Password is incorrect',
                data: null
            });
        }

    }

    // let checkQuery = `SELECT Count(EmployeeId) empCount FROM employee WHERE Email = '${req.body.Email}'`;

    // connection.query(checkQuery, function (objCheck) {

    //     // console.log(objCheck);res.send({message:'test'});return;


    //     if (!objCheck || !objCheck.response[0].empCount) {
    //         res.status(400).send({
    //             success: false,
    //             message: `Email address not found`,
    //             data: null
    //         });
    //         return;
    //     }
    // });



    let letter_count = 8;
    let tempPassword = '';
    for (let l = 0; l < letter_count; l++) {
        let ucase = Math.floor((Math.random() * 26) + 97);
        let lcase = Math.floor((Math.random() * 26) + 65);
        let num = Math.floor((Math.random() * 10) + 48);
        let arr = [ucase, lcase, num];
        let index = Math.floor(Math.random() * 3);
        let charCode = arr[index];
        tempPassword += String.fromCharCode(charCode);
    }

    let password = !req.body.Password ? tempPassword : req.body.Password;

    console.log(password);


    let query = `UPDATE employee SET Salt = UUID() WHERE Email = '${req.body.Email}';
                UPDATE employee SET Password = MD5(CONCAT_WS('${password}', '|', Salt)) WHERE Email = '${req.body.Email}';`;


    console.log(query);


    let isReset = !req.body.Password;
    let currentEmail = req.body.Email;

    connection.query(query, function (obj) {

        // send out a mail, only for password resets
        if (isReset) {
            let emailObj = {
                message: {
                    from: "\"🔔 SEPM Admin\"  sepm.management@gmail.com",
                    to: [
                        currentEmail
                    ],
                    subject: "Password Reset",
                    html: `<div 
                            style="
                                width:55%;
                                padding:35px;
                                font-family:Verdana,Tahoma,Arial,sans-serif;
                                background:#eee;
                                border:1px solid #777;
                                margin:10px auto
                            ">
                            <h1 style="color:#7ad;font-family:Tahoma,Arial,sans-serif;font-weight:200">Your password has been reset</h1>
                            <p>
                                You (or someone else) has requested a password reset for your SEPM account. Please log in to SEPM with the password 
                                <code style="font-size:20px;color:#699;font-weight:bold">${tempPassword}</code>. Please remember to change your password afterwards.
                            </p>
                        </div>`,
                }
            };

            // mail.sendgmailfunction(emailObj);
        }

        res.send({
            success: obj.error == null,
            message: obj.error || `Success`,
            data: obj.response
        });

    });

}


//list All Employee By Manager Or Organization 
exports.listByAllEmployee = (req, res) => {

    if (!req.query.OrganizationId) {
        return res.status(400).send({
            message: "Organization Id cannot be empty"
        });
    }


    connection.query(`SELECT e.*, o.*
                        FROM employee e
                        JOIN organization o ON e.OrganizationId = o.OrganizationId    
                        ORDER BY e.FullName
                        `, function (obj) {
        if (obj.response.length)
            res.status(200).send({
                success: true,
                message: null,
                data: obj.response
            });
        else
            res.status(400).send({
                success: false,
                message: ``,
                data: null
            });
    });
}

// list Employee Best on Project And Manager 
exports.EmployeeList_best_on_ManagerId = (req, res) => {

    var projects = [];
    var query = `SELECT p.* FROM project p 
                JOIN project_employee_map pem ON p.ProjectId = pem.ProjectId
                WHERE pem.EmployeeId = '${req.query.EmployeeId}'
                AND pem.ProjectRoleId = 1  
                group by p.ProjectName, p.ProjectId`;

    connection.query(query, function (obj) {

        for (var i = 0; i < obj.response.length; i++) {

            projects.push(obj.response[i].ProjectId);
        }

        let empQuery = `SELECT DISTINCT e.*, o.*
        FROM employee e
        JOIN organization o ON e.OrganizationId = o.OrganizationId     
        JOIN project_employee_map pem ON e.EmployeeId = pem.EmployeeId
        AND pem.ProjectId IN (${projects})
        ORDER BY e.FullName`;
        console.log(empQuery);
        connection.query(empQuery, function (obj) {
            if (obj.response.length)
                res.status(200).send({
                    success: true,
                    message: null,
                    data: obj.response
                });
            else
                res.status(400).send({
                    success: false,
                    message: ``,
                    data: null
                });
        });
    });

}

exports.missing_work_logs_listByProject = (req, res) => {

    if (!req.query.OrganizationId) {
        return res.status(400).send({
            message: "Organization Id cannot be empty"
        });
    }

    if (!req.query.ProjectId) {
        return res.status(400).send({
            message: "Project Id cannot be empty"
        });
    }

    connection.query(`SELECT DISTINCT  e.*, o.*
                        FROM employee e
                        JOIN organization o ON e.OrganizationId = o.OrganizationId     
                        JOIN project_employee_map pem ON e.EmployeeId = pem.EmployeeId
                        AND pem.ProjectId IN (${req.query.ProjectId})
                        ORDER BY e.FullName
                        `, function (obj) {
        if (obj.response.length)
            res.status(200).send({
                success: true,
                message: null,
                data: obj.response
            });
        else
            res.status(400).send({
                success: false,
                message: ``,
                data: null
            });
    });
}


