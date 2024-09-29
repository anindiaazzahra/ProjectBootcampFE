async function fetchSaldo() {
    const token = localStorage.getItem('jwtToken');
    const id = localStorage.getItem('userId');
    const response = await fetch(`/ApiMstUser/GetUserById?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    if (!response.ok) {
        alert('failed to fetch saldo');
        return;
    }

    const jsonData = await response.json();
    if (jsonData.success) {
        const saldo = jsonData.data.balance;
        document.getElementById('userSaldo').textContent = `Saldo Anda: Rp ${saldo}`;
    } else {
        alert('No users')
    }
}

function showUpdateSaldoModal() {
    document.getElementById('userBalance').value;
    $('#updateSaldoModal').modal('show');
}

async function updateSaldo() {
    const balance = document.getElementById('userBalance').value;
    const id = localStorage.getItem('userId');
    const token = localStorage.getItem('jwtToken');
    var saldo = 0

    const response = await fetch(`/ApiMstUser/GetUserById?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    if (!response.ok) {
        alert('failed to fetch saldo');
        return;
    }
    const jsonData = await response.json();
    if (jsonData.success) {
        saldo = jsonData.data.balance
    } else {
        alert('No users')
    }

    const reqUpdateSaldoDto = {
        balance: parseFloat(balance) + saldo
    };

    fetch(`/ApiLender/UpdateSaldo/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqUpdateSaldoDto)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Failed to add saldo');
                });
            }
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                return response.text();
            }
        })
        .then(data => {
            if (typeof data === 'string') {
                alert(data);
            } else {
                alert('Saldo added successfully');
            }
            $('#updateSaldoModal').modal('hide');
            fetchSaldo();
        })
        .catch(error => {
            alert('Error adding saldo: ' + error.message);
        });
}

async function fetchLoans() {
    const token = localStorage.getItem('jwtToken');
    const id = localStorage.getItem('userId');
    var saldo = 0

    const userResponse = await fetch(`/ApiMstUser/GetUserById?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    if (!userResponse.ok) {
        alert('failed to fetch saldo');
        return;
    }
    const jsonData = await userResponse.json();
    if (jsonData.success) {
        saldo = jsonData.data.balance
    } else {
        alert('No users')
    }

    const response = await fetch('/ApiLender/GetAllLoans', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    if (!response.ok) {
        alert('failed to fetch loans');
        return;
    }

    const loansData = await response.json();
    if (loansData.success) {
        const filteredLoans = loansData.data.filter(loan => loan.amount <= saldo && loan.status === 'requested') 
        populateLoanTable(filteredLoans);
    } else {
        alert('No loans')
    }
}

function populateLoanTable(loans) {
    const loanTableBody = document.querySelector('#loanTable tbody');
    loanTableBody.innerHTML = '';

    loans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${loan.borrowerName} </td>
        <td>${loan.amount} </td>
        <td>${loan.interestRate} </td>
        <td>${loan.duration} </td>
        <td>${loan.status} </td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="approveLoan('${loan.loanId}')">Approve</button>
        </td>
        `;
        loanTableBody.appendChild(row);
    })
}

async function approveLoan(id) {
    console.log(id);
    const token = localStorage.getItem('jwtToken');
    const _lenderId = localStorage.getItem('userId');

    const reqApproveLoanDto = {
        loanId: id,
        lenderId: _lenderId
    };

    console.log(reqApproveLoanDto);

    const response = await fetch('/ApiLender/ApproveLoan', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqApproveLoanDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to approve loan');
            }
            return response.json();
        })
        .then(data => {
            alert('Loan approved successfully!');
            fetchLoans();
        })
        .catch(error => {
            alert('Error approving loan: ' + error.message);
        });
}

async function fetchHistoryLoans() {
    const token = localStorage.getItem('jwtToken');
    const id = localStorage.getItem('userId');

    const response = await fetch('/ApiLender/GetHistoryLoans?lenderId=${id}', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    if (!response.ok) {
        alert('failed to fetch loans');
        return;
    }

    const loansData = await response.json();
    if (loansData.success) {
        populateHistoryLoanTable(loansData.data);
    } else {
        alert('No loans')
    }
}

function populateHistoryLoanTable(loans) {
    const historyLoanTableBody = document.querySelector('#historyLoanTable tbody');
    historyLoanTableBody.innerHTML = '';

    loans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${loan.borrowerName} </td>
        <td>${loan.amount} </td>
        <td>${loan.repaidAmount} </td>
        <td>${loan.balanceAmount} </td>
        <td>${loan.repaidStatus} </td>
        <td>${loan.paidAt} </td>
        `;
        historyLoanTableBody.appendChild(row);
    })
}

window.onload = function () {
    fetchSaldo();
    fetchLoans();
    fetchHistoryLoans();
};