'use strict'

const username = document.querySelector('#username');
const password = document.querySelector('#password');
const floatingBackground = document.querySelector('.inputs-background');

let users = [
    {
        name: 'Saurabh Panchal',
        username: 'srbh',
        password: '123',
        dob: '08/03/1999',
        balance: 650,
        transactions: [
            {type: 'deposit', amount: 500, balanceAfterThisTransaction: 500, dt: ''},
            {type: 'deposit', amount: 200, balanceAfterThisTransaction: 700, dt: ''},
            {type: 'withdraw', amount: 50, balanceAfterThisTransaction: 650, dt: ''}
        ]
    },
    {
        name: 'Punit Panchal',
        username: 'ps',
        password: '123',
        dob: '20/10/1998',
        balance: 650,
        transactions: [
            {type: 'deposit', amount: 500, balanceAfterThisTransaction: 500, dt: ''},
            {type: 'deposit', amount: 200, balanceAfterThisTransaction: 700, dt: ''},
            {type: 'withdraw', amount: 50, balanceAfterThisTransaction: 650, dt: ''}
        ]
    }
];

let currentUser;

const login = document.querySelector("#login_button");
const messageBox = document.querySelector('.message-box');
const messageText = document.querySelector('.message-text');
const depositInput = document.querySelector('#deposit_input');
const depositButton = document.querySelector('#deposit_button');
const depositForm = document.querySelector('#deposit_form');
const withdrawInput = document.querySelector('#withdraw_input');
const withdrawButton = document.querySelector('#withdraw_button');
const withdrawForm = document.querySelector('#withdraw_form');

const showTransactions = (transaction) =>{
    if(transaction.type === 'deposit'){
        document.querySelector('.passbook-section')
        .innerHTML += `<div>
                        <small>
                            <span class="deposit_amount">Deposit</span>
                            <span style="float: right">Total Balance: Rs ${transaction.balanceAfterThisTransaction}</span>
                        </small>
                        <span>Rs ${transaction.amount}</span>
                      </div>`;
    } else {
        document.querySelector('.passbook-section')
        .innerHTML += `<div>
                        <small>
                            <span class="withdrawn_amount">Withdraw</span>
                            <span style="float: right">Total Balance: Rs ${transaction.balanceAfterThisTransaction}</span>
                        </small>
                        <span>Rs ${transaction.amount}</span>
                      </div>`;
    }
    
}

//this function updates UI ie. either remove transactions or show on login
const updateUI = (userAccount) =>{
    if(userAccount !== undefined){
        currentUser = userAccount;

        //clear inputs

        //enable inputs 
        depositInput.removeAttribute('disabled');
        depositButton.removeAttribute('disabled');
        withdrawInput.removeAttribute('disabled');
        withdrawButton.removeAttribute('disabled');

        document.querySelector('#username').value = '';
        document.querySelector('#password').value = '';

        //show welcome message 
        messageBox.style.display = 'block';
        messageText.textContent = `Welcome back ${userAccount.name}`;
        setTimeout(()=>{   //clear welcome message after 3 sec
            messageBox.textContent = '';
            messageBox.style.display = 'none';
        }, 3000);
        
        document.querySelector('.passbook-section').classList.remove('unavailable');
        document.querySelector('.passbook-section').classList.add('available');

        userAccount.transactions.forEach(transaction =>{
            showTransactions(transaction);
        });
        
    } else {
        currentUser = undefined;
        //clear inputs 

        //disabled inputs
        depositInput.setAttribute('disabled', true);
        depositButton.setAttribute('disabled', true);
        withdrawInput.setAttribute('disabled', true);
        withdrawButton.setAttribute('disabled', true);

        //show invalid credentials message 
        messageBox.style.display = 'block';
        messageText.textContent = 'Invalid username or password';

        document.querySelector('.passbook-section').classList.remove('available');
        document.querySelector('.passbook-section').classList.add('unavailable');
    }
}

depositForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //console.log(typeof (currentUser.transactions.at(currentUser.transactions.length-1)).balanceAfterThisTransaction);
    currentUser.transactions.push({
        type: 'deposit',
        amount: depositInput.value,
        balanceAfterThisTransaction: Number((currentUser.transactions.at(currentUser.transactions.length-1)).balanceAfterThisTransaction) + Number(depositInput.value),
        dt: new Date()
    });

    showTransactions(currentUser.transactions.at(currentUser.transactions.length-1));

    //clear inputs 
    depositInput.value = '';

    //update user in database
    users[users.indexOf(u => u.username === currentUser.username && u.password === currentUser.password)] = currentUser;
})

withdrawForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    const amount = Number(withdrawInput.value);
    const lastBalance = (currentUser.transactions.at(currentUser.transactions.length-1)).balanceAfterThisTransaction;
    if(lastBalance-amount < 0 || amount === 0 || lastBalance === 0){
        document.querySelector('.unauthorized_transaction').style.display = 'block';
        setTimeout(()=>{   //clear message after 3 sec
            document.querySelector('.unauthorized_transaction').style.display = 'none';
        }, 3000);
    } else {
        currentUser.transactions.push({
            type: 'withdraw',
            amount: withdrawInput.value,
            balanceAfterThisTransaction: Number((currentUser.transactions.at(currentUser.transactions.length-1)).balanceAfterThisTransaction) - Number(withdrawInput.value),
            dt: new Date()
        });
    
        showTransactions(currentUser.transactions.at(currentUser.transactions.length-1));
        
        //clear input    
        withdrawInput.value = '';
    }

    //update user in database
    users[users.indexOf(u => u.username === currentUser.username && u.password === currentUser.password)] = currentUser;
})

login.addEventListener('click', ()=>{
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const user = users.find(u => (u.username === username && u.password === password));
    updateUI(user);
})

const showFloatingBack = function(e){
    const userCoord = e.target.getBoundingClientRect();
    
    //setting initial position of floating background 
    floatingBackground.style.visibility = 'visible';
    floatingBackground.style.height = (userCoord.height + 15) + 'px';
    floatingBackground.style.width = (userCoord.width + 15) + 'px';
    floatingBackground.style.left = (userCoord.x - floatingBackground.closest('.row').getBoundingClientRect().x - 5) + 'px';
}

const hideFloatingBack = function(){
    floatingBackground.style.visibility = 'hidden';
}

username.addEventListener('focus', showFloatingBack.bind());
password.addEventListener('focus', showFloatingBack.bind());

username.addEventListener('blur', hideFloatingBack);
password.addEventListener('blur', hideFloatingBack);

document.querySelector('.close').addEventListener('click', (e) =>{
    e.target.parentElement.style.display = 'none';
})


