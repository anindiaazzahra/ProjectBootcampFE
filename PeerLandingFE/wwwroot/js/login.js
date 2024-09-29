async function submitLogin() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/ApiLogin/Login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ email, password}),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('jwtToken', result.data.token);
            localStorage.setItem('userId', result.data.id);

            const userRole = result.data.role;
            console.log(userRole);

            if (userRole === 'admin') {
                window.location.href = 'Home/Index';
            } else if (userRole === 'lender') {
                window.location.href = '/Lender/Index';
            } else if (userRole === 'borrower') {
                window.location.href = '/Borrower/Index';
            }
        } else {
            alert(result.message || 'Login Failed. Please Try Again.');
        }
    }
    catch (error) {
        alert('An error ocurred while loggin in : ' + error.message);
    }
}