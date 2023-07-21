ZOHO.embeddedApp.on("PageLoad", async function (data) {
    console.log(data);
    const loanRec = await ZOHO.CRM.API.getRecord({
        Entity: data.Entity,
        RecordID: data.EntityId
    });
    // console.log(loanRec);
    console.log(loanRec.data[0].Recipient.id);
    const contactRec = await ZOHO.CRM.API.getRecord({
        Entity: "Contacts",
        RecordID: loanRec.data[0].Recipient.id
    });
    const loanHistory = await ZOHO.CRM.API.getRelatedRecords({
        Entity: "Contacts",
        RecordID: loanRec.data[0].Recipient.id,
        RelatedList: "Loan_History",
        page: 1,
        per_page: 200
    })

    displayBasicDetails(contactRec.data[0]);
    processLoanHistory(loanHistory.data);
})

ZOHO.embeddedApp.init();

function moveToNextState() {
    ZOHO.CRM.BLUEPRINT.proceed();
}

function closePopup() {
    ZOHO.CRM.UI.Popup.close();
}

function generateRandomCreditScore() {
    return Math.floor(Math.random() * 900);
}
function displayCibilScoreGauge(creditScore){
    // const creditScore = 720;

    // Create the trace for the gauge chart
    const trace = {
        type: "indicator",
        mode: "gauge+number",
        value: creditScore,
        title: { text: "Credit Score", font: { size: 24 } },
        gauge: {
            axis: { range: [null, 850], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "#1f77b4" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
                { range: [0, 350], color: "red" },
                { range: [350, 550], color: "orange" },
                { range: [550, 700], color: "yellow" },
                { range: [700, 850], color: "green" },
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: creditScore,
            },
        },
    };

    // Set the layout for the gauge chart (empty, as we only have one chart)
    const layout = {};

    // Create the plot
    Plotly.newPlot("plotly-visualization", [trace], layout);
}
function displayBasicDetails(data) {
    console.log(data);
    document.getElementById('name').textContent = data.Full_Name;
    document.getElementById('email').textContent = data.Email;
    document.getElementById('panId').textContent = data.PAN_ID;
    document.getElementById('address').textContent = data.Mailing_Street + data.Mailing_Zip
}

function processLoanHistory(loanHistory) {
    //   var loanHistoryContainer = document.getElementById('loanHistory');
    //   loanHistory.forEach(function(loan, index) {
    //     var loanDiv = document.createElement('div');
    //     loanDiv.classList.add('loan');

    //     var title = document.createElement('h3');
    //     title.classList.add('loan-title');
    //     title.textContent = 'Loan ' + (index + 1);
    //     loanDiv.appendChild(title);

    //     var loanId = document.createElement('p');
    //     loanId.textContent = 'Loan ID: ' + loan.Name;
    //     loanDiv.appendChild(loanId);

    //     var loanAmount = document.createElement('p');
    //     loanAmount.textContent = 'Loan Amount: ' + loan.Amount;
    //     loanDiv.appendChild(loanAmount);

    //     // Add other loan details as needed
    //     var loanStatus = document.createElement('p');
    //     loanStatus.textContent = 'Loan Status: ' + loan.Loan_Status;
    //     loanDiv.appendChild(loanStatus);

    //     loanHistoryContainer.appendChild(loanDiv);
    //   });
    var count = 1;
    var creditScore;
    var loanHistoryTableBody = document.getElementById('loanHistoryTableBody');
    loanHistory.forEach(function (loan, index) {
        if (!loan.Bank_Name) return;
        var row = document.createElement('tr');

        var snCell = document.createElement('td');
        snCell.textContent = count;
        row.appendChild(snCell);
        count++

        var bankName = document.createElement('td');
        bankName.textContent = loan.Bank_Name;
        row.appendChild(bankName);

        var loanAmountCell = document.createElement('td');
        loanAmountCell.textContent = loan.Amount;
        row.appendChild(loanAmountCell);

        var loanRqsDate = document.createElement('td');
        loanRqsDate.textContent = loan.Loan_Requested_Date;
        row.appendChild(loanRqsDate);

        var loanIssuedData = document.createElement('td');
        loanIssuedData.textContent = loan.Loan_Issued_Date;
        row.appendChild(loanIssuedData);

        var loanDueDate = document.createElement('td');
        loanDueDate.textContent = loan.Loan_Due_Date;
        row.appendChild(loanDueDate);

        var emiPaidOn = document.createElement('td');
        emiPaidOn.textContent = loan.EMI_Paid_On;
        row.appendChild(emiPaidOn);

        var loanEndsOn = document.createElement('td');
        loanEndsOn.textContent = loan.Loan_Ends_On;
        row.appendChild(loanEndsOn);

        var loanStatus = document.createElement('td');
        loanStatus.textContent = loan.Loan_Status;
        row.appendChild(loanStatus);

        if (loan.Loan_Status === 'Default') {
            row.classList.add('default-loan-row');
            creditScore = Math.floor(Math.random() * 350);
        }

        loanHistoryTableBody.appendChild(row);
    });
    // creditScore = creditScore ? creditScore : generateRandomCreditScore();
    creditScore = 750;
    displayCibilScoreGauge(creditScore);
}
