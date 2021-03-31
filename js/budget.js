//Select Elemnets
const balanceEl = document.querySelector('.balance .value');
const incomeTotalEl = document.querySelector('.income-total');
const outcomeTotalEl = document.querySelector('.outcome-total');
const incomeEl = document.querySelector('#income');
const expenseEl = document.querySelector('#expense');
const allEl = document.querySelector('#all');
const incomeList = document.querySelector('#income .list');
const expenseList = document.querySelector('#expense .list');
const allList = document.querySelector('#all .list');

//Select BTN
const expenseBtn = document.querySelector('.tab1');
const incomeBtn = document.querySelector('.tab2');
const allBtn = document.querySelector('.tab3');

//Input BTN
const addExpense = document.querySelector('.add-expense');
const expenseTitle = document.getElementById('expense-title-input');
const expenseAmount = document.getElementById('expense-amount-input');

const addIncome = document.querySelector('.add-income');
const incomeTitle = document.getElementById('income-title-input');
const incomeAmount = document.getElementById('income-amount-input');



//Variables
let ENTRY_LIST = [];
let balance = 0, income = 0, outcome = 0;

//Look of there is saved data in LocalStorage
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

const DELETE = "delete", EDIT = "edit";


//EVENT LISTENERS
expenseBtn.addEventListener("click",function(){
 show(expenseEl);
 hide([incomeEl, allEl]);
 active(expenseBtn);
 inactive([incomeBtn, allBtn]);

});

incomeBtn.addEventListener("click",function(){
 show(incomeEl);
 hide([expenseEl, allEl]);
 active(incomeBtn);
 inactive([expenseBtn, allBtn]) ;
} );

allBtn.addEventListener("click",function(){
    show(allEl);
    hide( [expenseEl, incomeEl] );
    active(allBtn);
    inactive([expenseBtn, incomeBtn]) ;
});


incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);


function deleteOrEdit(event){
 const targetBtn = event.target;
 
 const entry = targetBtn.parentNode;

 if( targetBtn.id == DELETE){
    deleteEntry(entry);
 }else if( targetBtn.id == EDIT){
    editEntry(entry);
 }
}


function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1)
    
    updateUI();
}

function editEntry(entry){
    console.log(entry.parentNode);
    let ENTRY = ENTRY_LIST[entry.parentNode.id];

    if(ENTRY.type == "income"){
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    }else if(ENTRY.type == "expense"){
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }

    deleteEntry(entry)
}


addExpense.addEventListener('click', function(){
//If one of the inputs is empty 
 if(!expenseTitle.value || !expenseAmount.value) return;

//save the entry to entry_list
let expense = {
    type: "expense",
    title : expenseTitle.value,
    amount: parseInt(expenseAmount.value)
}
ENTRY_LIST.push(expense);

updateUI();
clearInput( [expenseTitle, expenseAmount]);


});

addIncome.addEventListener('click', function(){
    //If one of the inputs is empty 
     if(!incomeTitle.value || !incomeAmount.value) return;
    
    //save the entry to entry_list
    let income = {
        type: "income",
        title : incomeTitle.value,
        amount: parseInt(incomeAmount.value)
    }
    ENTRY_LIST.push(income);

    updateUI();
    clearInput( [incomeTitle, incomeAmount]);
    
    })

//FUNCTIONS
function updateUI(){
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    // DETERMINE SIGN OF BALANCE
    let sign = (income >= outcome) ? "$" : "-$";

    // UPDATE UI
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`;
    incomeTotalEl.innerHTML = `<small>$</small>${income}`;

    clearElement( [expenseList, incomeList, allList] );

    ENTRY_LIST.forEach( (entry, index) => {
        if( entry.type == "expense" ){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index)
        }else if( entry.type == "income" ){
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index)
    });

    updateChart(income,outcome);
}


function showEntry(list, type, title, amount, id){
 const entry = `<li id="${id}" class="${type}">
                   <div class="entry"> ${title} : $${amount}</div>
                   <div><i id="edit" class="fa fa-pencil"></i></div>
                   <div><i id="delete" class="fa fa-trash"></i></div>
                   </li>`;

 const position = 'afterbegin';

 list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list){
    let sum = 0;

    list.forEach( entry => {
        if(entry.type ==type){
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(income, outcome){
  return income - outcome;
}

function clearInput(inputs){
    inputs.forEach(input =>{
        input.value = "";
    })
}
function show(element){
    element.classList.remove('hide');
}

function hide(elements){
    elements.forEach(element => {
        element.classList.add('hide');
    })
}

function active(element){
    element.classList.add('active');
}
function inactive(elements){
    elements.forEach(element =>{
        element.classList.remove('active');
    });
}