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

function showRequestLoanModal() {
    document.getElementById('amount').value;
    document.getElementById('interestRate').value;
    $('#requestLoanModal').modal('show');
}

async function requestLoan() {
    const amount = document.getElementById('amount').value;
    const interestRate = document.getElementById('interestRate').value;
    const borrowerId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwtToken');

    const reqLoanDto = {
        amount: amount,
        interestRate: interestRate,
        borrowerId: borrowerId
    };

    const response = fetch(`/ApiBorrower/NewLoan`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqLoanDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add loan');
            }
            return response.json();
        })
        .then(data => {
            alert('Loan add successfully')
            $('#requestLoanModal').modal('hide');
            fetchRequestedLoans();
        })
        .catch(error => {
            alert('Error adding user: ' + error.message);
        });
}

async function fetchRequestedLoans() {
    const token = localStorage.getItem('jwtToken');
    const id = localStorage.getItem('userId');
    const status = 'requested';

    const response = await fetch(`/ApiLender/GetAllLoans?status=${status}&borrowerId=${id}`, {
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
        populateRequestedLoanTable(loansData.data);
    } else {
        alert('No loans')
    }
}

function populateRequestedLoanTable(loans) {
    const requestedLoanTableBody = document.querySelector('#requestedLoanTable tbody');
    requestedLoanTableBody.innerHTML = '';

    loans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${loan.amount} </td>
        <td>${loan.interestRate} </td>
        <td>${loan.duration} </td>
        <td>${loan.status} </td>
        `;
        requestedLoanTableBody.appendChild(row);
    })
}

async function requestLoan() {
    const amount = document.getElementById('amount').value;
    const interestRate = document.getElementById('interestRate').value;
    const borrowerId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwtToken');

    const reqLoanDto = {
        amount: amount,
        interestRate: interestRate,
        borrowerId: borrowerId
    };

    const response = fetch(`/ApiBorrower/NewLoan`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqLoanDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add loan');
            }
            return response.json();
        })
        .then(data => {
            alert('Loan add successfully')
            $('#requestLoanModal').modal('hide');
            fetchRequestedLoans();
        })
        .catch(error => {
            alert('Error adding user: ' + error.message);
        });
}

async function fetchHistoryLoans() {
    const token = localStorage.getItem('jwtToken');
    const id = localStorage.getItem('userId');

    const response = await fetch(`/ApiLender/GetAllLoans?borrowerId=${id}`, {
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
        <td>${loan.amount}</td>
        <td>${loan.interestRate}</td>
        <td>${loan.duration}</td>
        <td>${loan.status}</td>
        <td>
            ${loan.status !== 'funded' ? '<button class="btn btn-primary btn-sm" onclick="showLoanDetail(\'' + loan.loanId + '\')">Detail</button>' : ''}
            ${loan.status === 'funded' ? '<button class="btn btn-success btn-sm" onclick="openMonthlyRepaymentModal(\'' + loan.loanId + '\')">Pay</button>' : ''}
        </td>
        `;
        historyLoanTableBody.appendChild(row);
    });
}

async function openMonthlyRepaymentModal(loanId) {
    const token = localStorage.getItem("jwtToken");

    const repaymentByLoan = await fetch(`/ApiRepayment/GetRepaymentByLoanId?loanId=${loanId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!repaymentByLoan.ok) {
        alert('Gagal mengambil data cicilan.');
        return;
    }

    const repaymentData = await repaymentByLoan.json();

    if (repaymentData.success) {
        const repaymentId = repaymentData.data.id;

        const monthlyRepaymentByRepaymentId = await fetch(`/ApiMonthlyRepayment/GetMonthlyRepaymentByRepaymentId?repaymentId=${repaymentId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!monthlyRepaymentByRepaymentId.ok) {
            alert('Gagal mengambil pembayaran bulanan.');
            return;
        }

        const monthlyRepaymentData = await monthlyRepaymentByRepaymentId.json();

        if (monthlyRepaymentData.success) {
            const monthlyRepaymentRows = document.getElementById('monthlyRepaymentRows');
            monthlyRepaymentRows.innerHTML = '';

            monthlyRepaymentData.data.forEach((repayment, index) => {
                const row = document.createElement('tr');

                row.setAttribute('repayment-id', repaymentId);

                const monthCell = document.createElement('td');
                monthCell.textContent = `${index + 1}`;

                const amountCell = document.createElement('td');
                amountCell.textContent = repayment.amount;

                const statusCell = document.createElement('td');
                const checkBox = document.createElement('input');
                checkBox.type = 'checkbox';
                checkBox.checked = repayment.status;
                checkBox.disabled = repayment.status;

                statusCell.appendChild(checkBox);

                row.appendChild(monthCell);
                row.appendChild(amountCell);
                row.appendChild(statusCell);

                monthlyRepaymentRows.appendChild(row);
            });

            $('#monthlyRepaymentModal').modal('show');
        } else {
            alert(monthlyRepaymentData.message);
        }
    } else {
        alert(repaymentData.message);
    }
}

async function submitRepayment() {
    const token = localStorage.getItem("jwtToken");
    const selectedRepayments = [];

    const monthlyRepaymentRows = document.querySelectorAll('#monthlyRepaymentRows tr');

    monthlyRepaymentRows.forEach(row => {
        const checkBox = row.querySelector('input[type="checkbox"]');

        if (checkBox.checked && !checkBox.disabled) {
            const repaymentId = row.getAttribute('repayment-id');

            selectedRepayments.push({
                repaymentId: repaymentId,
            });
        }
    });

    if (selectedRepayments.length === 0) {
        alert('Pilih setidaknya satu pembayaran untuk diproses.');
        return;
    }

    const payload = selectedRepayments;

    try {
        const response = await fetch('/ApiMonthlyRepayment/UpdateMonthlyRepaymentStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            try {
                const data = await response.json();
                alert('Pembayaran berhasil diajukan!');
                $('#monthlyRepaymentModal').modal('hide');
                fetchHistoryLoans();
            } catch (err) {
                const textResponse = await response.text();
                console.error('Respon non-JSON:', textResponse);
                alert(`Error: ${textResponse}`);
            }
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Permintaan gagal:', error);
        alert('Permintaan gagal, silakan coba lagi.');
    }
}

window.onload = function () {
    fetchSaldo();
    fetchRequestedLoans();
    fetchHistoryLoans();
};