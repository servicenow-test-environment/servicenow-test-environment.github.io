import { credentials } from "../../app.js";
import { ServiceNow } from "../../lib/servicenowAsync.js";

export async function oneTwo() {
    const sn = ServiceNow;
    const connector = new sn(credentials.instName, credentials.instUserName, credentials.instPassword, true);
    connector.Authenticate();
    console.log(connector);


    // Get data/specific record ServiceNow MiniProject One group from table
    let isGroupFound = false;
    const fieldsFindGroup = [
        'name',
        'email',
        'description',
        'manager.name',
    ];
    const filtersFindGroup = [,
        'name=ServiceNow MiniProject One',
        'email=snow.web.app@example.com',
        'description=This is a test group for ServiceNow Task Verifier Web Application.',
        'manager.name=Abel Tuter'
    ];
    const findGroup = await connector.getTableData(fieldsFindGroup, filtersFindGroup, 'sys_user_group', function (res) {console.log(res)});
    if (findGroup.data.result.length > 0) {
        isGroupFound = true;
    }


    // Check if User is Assigned to the Group (sys_user_grmember table) a.k.a. Test Two
    let isGroupAssigned = false;
    const fieldsFindGroupAssigned = [
        "group",
        "user",
    ];
    const filtersFindGroupAssigned = [
        '[user][display_value]=John Doe',
    ];
    const findGroupAssigned = await connector.getTableData(fieldsFindGroupAssigned, filtersFindGroupAssigned, 'sys_user_grmember', function (res) {console.log(res)});
    console.log(findGroupAssigned)
    let firstGroupFound = false;
    let secondGroupFound = false;
    for (let i = 0; i < findGroupAssigned.data.result.length; i++) {
        let currentUser = findGroupAssigned.data.result[i]['user']['display_value'];
        let currentGroup = findGroupAssigned.data.result[i]['group']['display_value'];
        if (currentUser == "John Doe" && currentGroup == "Service Desk") {
            firstGroupFound = true;
        }
        if (currentUser == "John Doe" && currentGroup == "ServiceNow MiniProject One") {
            secondGroupFound = true;
        }
        if (firstGroupFound == true && secondGroupFound == true) {
            isGroupAssigned = true;
            console.log("User John Doe is in `Service Desk` and `Service Now MiniProject One` Groups.")
            break;
        }
    }


    // Check if Roles are Assigned to the User
    let isRoleAssigned = false;
    const fieldsFindRoleAssigned = [
        "user",
        "role"
    ];
    const filtersFindRoleAssigned = [
        // Leave empty, XML file for the table sys_user_has_role in ServiceNow returns only SysIDs and not the values of the records
    ];
    const findRoleAssigned = await connector.getTableData(fieldsFindRoleAssigned, filtersFindRoleAssigned, 'sys_user_has_role', function (res) {console.log(res)});
    let roleFound = false;
    for (let i = 0; i < findRoleAssigned.data.result.length; i++) {
        let currentUser = findRoleAssigned.data.result[i]['user']['display_value'];
        let currentRole = findRoleAssigned.data.result[i]['role']['display_value'];
        if (currentUser == "John Doe" && currentRole == "itil") {
            isRoleAssigned = true;
            console.log("John Doe has `itil` role assigned.")
        }
    }
    

    if (isGroupFound && isGroupAssigned && isRoleAssigned) {
        console.log("Test Two: All Tasks Completed.")
        return true;
    } else {
        console.log("Test Two: Tasks Not Completed.")
        // Use the logic below to display which specific task was not completed
        if (!isGroupFound) {
            console.log("Group `ServiceNow MiniProject One` not created.")
            return false;
        }
        if (!isGroupFound) {
            if (!firstGroupFound) {
                console.log("User `John Doe` is not a member of  `Service Desk` Group.")
            }
            if (!secondGroupFound) {
                console.log("User `John Doe` is not a member of `ServiceNow MiniProject One` Group.")
            }
        }
        if (!isRoleAssigned) {
            console.log("User `John Doe` does not have role `itil` assigned");
        }
        return false;
    }
}
// oneTwo();
