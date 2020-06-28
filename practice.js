//Practice for app.js

var budgetController = (function(){

    //Create constructor function for Expense
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    //Create a function in Expense prototype which calculate percentages of each individual elememnt
    Expense.prototype.calcPercentages = function(){
        if(dataStructure.total.inc > 0 && dataStructure.total.inc > dataStructure.total.exp){
            this.percentage = Math.round((this.value/dataStructure.total.inc) * 100);
        }        
    }

    //Create a function that calculates percgentages for all elements in array
    var getPercentages = function(){
        var percentages = dataStructure.allItem.exp.map(function(current){
            current.calcPercentages();
            return current.percentage;
        });
        return percentages;
    }

    //Create constructor function for Income
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //Create Data Structure
    var dataStructure = {
        allItem : {
            exp : [],
            inc : []
        },
        total : {
            inc : 0,
            exp : 0
        }
    }

    //Function to calculate budget
    var budgetCalculation = function(){
        var expPercentage = 0, sum = 0;
        dataStructure.allItem.inc.forEach(function(current){
            sum = sum + parseInt(current.value);
        });
        dataStructure.total.inc = sum;

        sum = 0;
        dataStructure.allItem.exp.forEach(function(current){
            sum = sum + parseInt(current.value);
        });
        dataStructure.total.exp = sum;

        if(dataStructure.total.inc > 0){
            expPercentage = Math.round((dataStructure.total.exp * 100)/dataStructure.total.inc);
        }
        return{
            finalBudget : dataStructure.total.inc - dataStructure.total.exp,
            expPercentage : expPercentage,
            totalIncome : dataStructure.total.inc,
            totalExpense : dataStructure.total.exp
        }
    }

    //create function addItem
    var addItemInDataStructure = function(input){
        var ID = 0, newItem;
        if(dataStructure.allItem[input.getType].length === 0){
            ID = 0;
        }
        else if(dataStructure.allItem[input.getType].length > 0){
            ID = parseInt(dataStructure.allItem[input.getType][dataStructure.allItem[input.getType].length - 1].id) + 1;
        }

        if(input.getType === 'inc'){
            newItem = new Income(ID, input.getDescription, input.getValue);
        }
        else if(input.getType === 'exp'){
            newItem = new Expense(ID, input.getDescription, input.getValue);
        }
        dataStructure.allItem[input.getType].push(newItem);

        return newItem;        
    }

    //function to delete Item
    var deleteItem = function(type, ID){
        var ids, index;
        ids = dataStructure.allItem[type].map(function(current){
            return current.id;
        });

        index = ids.indexOf(ID);
        if(index !== -1){
            dataStructure.allItem[type].splice(index, 1);
        }
    }

    return{
        addItem : function(input){
            return addItemInDataStructure(input);
        },

        calculateBudget : function(){
            return budgetCalculation();
        },

        deleteItem : function(type, ID){
            deleteItem(type, ID);
        },

        getPercentages : function(){
            return getPercentages();
        },

        testing : function(){
            return dataStructure;
        }        
    }
})();

var UIController = (function(){

    //Create an object containing labels for DOM objects

    var DOMStrings = {
        addBtn : '.add__btn',
        description : '.add__description',
        value : '.add__value',
        type : '.add__type',
        incomeList : '.income__list',
        expenseList : '.expenses__list',
        totalExpense : '.budget__expenses--value',
        totalIncome : '.budget__income--value',
        expensePercentage : '.budget__expenses--percentage',
        expenseItemPercentage : '.item__percentage',
        budgetValue : '.budget__value',
        container : '.container',
        month : '.budget__title--month'
    }


    //Make an getter function to take input from UI
    var getInputFromUI = function(){
        return{
            getDescription : document.querySelector(DOMStrings.description).value,
            getValue : document.querySelector(DOMStrings.value).value,
            getType : document.querySelector(DOMStrings.type).value
        }
    }

    //Clear Input Field
    var clearInputField = function(){
        document.querySelector(DOMStrings.description).value = '';
        document.querySelector(DOMStrings.value).value = '';
        document.querySelector(DOMStrings.description).focus();
    }

    //Function to add newItem in UI
    var addNewItem = function(input, type){
        var html, newHtml, element;
        if(type === 'inc'){
            element = DOMStrings.incomeList;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        else if(type === 'exp'){
            element = DOMStrings.expenseList;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        newHtml = html.replace('%id%', input.id);
        newHtml = newHtml.replace('%description%', input.description);
        newHtml = newHtml.replace('%value%', input.value);
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    }

    //Display Percentages
    var showPercentages = function(percentages){
        fields = document.querySelectorAll(DOMStrings.expenseItemPercentage);
        
        var nodeListForEach = function(list, callBack){
            for(var i = 0; i < list.length; i++){
                callBack(list[i], i);
            }
        };
        
        nodeListForEach(fields, function(current, index){
            if(percentages[index] > 0){
                current.textContent = percentages[index] + '%';
            }
            else{
                current.textContent = '--';
            }
            
        });
    }

    //function to display budget
    var showBudget = function(budget){
        if(budget.finalBudget > 0){
            document.querySelector(DOMStrings.budgetValue).textContent = '+ ₹' + budget.finalBudget;
        }
        else if(budget.finalBudget < 0){
            document.querySelector(DOMStrings.budgetValue).textContent = '- ₹' + Math.abs(budget.finalBudget);
        }
        else if(budget.finalBudget === 0){
            document.querySelector(DOMStrings.budgetValue).textContent = 0;
        }

        if(budget.expPercentage > 0 && budget.totalIncome > budget.totalExpense){
            document.querySelector(DOMStrings.expensePercentage).textContent = budget.expPercentage + '%';
        }
        else if(budget.expPercentage === 0 || budget.totalIncome < budget.totalExpense){
            document.querySelector(DOMStrings.expensePercentage).textContent = '--';
        }
        document.querySelector(DOMStrings.totalExpense).textContent = '- ₹' + parseInt(budget.totalExpense);
        document.querySelector(DOMStrings.totalIncome).textContent = '+ ₹' + parseInt(budget.totalIncome);
    }

    //Function to delete element
    var deleteElement = function(itemID){
        var element = document.getElementById(itemID);
        element.parentNode.removeChild(element);
    }

    //Function that handles type change event
    var changeEventHandler = function(){
        var fields = document.querySelectorAll(DOMStrings.type + ',' + DOMStrings.description + ',' + DOMStrings.value);
        var nodeListForEach = function(list, callback){
            for(var i = 0; i < list.length; i++){
                callback(list[i]);
            }
        }
        
        nodeListForEach(fields, function(current){
            current.classList.toggle('red-focus');
        });

        document.querySelector(DOMStrings.addBtn).classList.toggle('red');
    }

    //Return to make functions public
    return{
        //returns a function which deletes item
        deleteItem : function(itemID){
            deleteElement(itemID);
        },

        //returns a function which displays percentages
        displayPercentages : function(percentages){
            showPercentages(percentages);
        },

        //return DOM Strings
        getDOMStrings : function(){
            return DOMStrings;
        },
        
        //return input that we get from UI
        getInput : function(){
            return getInputFromUI();
        },

        //return a function to clear Fields
        clearField : function(){
            clearInputField();
        },

        //return a function that adds a new Item in UI
        addItem : function(input, type){
            addNewItem(input, type);
        },

        //function to display budget
        displayBudget : function(budget){
            showBudget(budget)
        },

        //return fucntion that cleans everything before the app starts
        cleanBudgetValues : function(){
            document.querySelector(DOMStrings.budgetValue).textContent = 0;
            document.querySelector(DOMStrings.expensePercentage).textContent = '--';
            document.querySelector(DOMStrings.totalExpense).textContent = 0;
            document.querySelector(DOMStrings.totalIncome).textContent = 0;
        },

        //Function to show month
        showMonth : function(){
            var date, year, month, day; 
            date = new Date();
            var monthValue = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Spetember', 'October', 'November', 'December'];
            year = date.getFullYear();
            month = date.getMonth();
            document.querySelector(DOMStrings.month).textContent = monthValue[month] + " " + year;
        },

        //returns a function that actually handles the type change event
        changeTypeEventHandler : function(){
            changeEventHandler();
        }
    }

})();

var controller = (function(budgetCtrl, UICtrl){
    
    //Call DOMStrings method from UIController to access all DOM labels
    var DOMStrings = UICtrl.getDOMStrings();
    
    //2. setup event listners
    function listenEvent(){
        //Listen to the Enter key Pressed Event
        document.addEventListener('keypress', function(event){
            /*
            * 'code' property for Enter key is "Enter"
            * 'charCode' property for Enter key is 13
            * 'key' property for Enter key is 'Enter' 
            */
            if(event.code === 'Enter' || event.charCode === 13 || event.key === 'Enter'){
                clickAddEventCtrl();
            }

        });

        //Listen to the add button
        document.querySelector(DOMStrings.addBtn).addEventListener('click', clickAddEventCtrl);

        //Listen to tghe delete button
        document.querySelector(DOMStrings.container).addEventListener('click', clickDeleteEventCtrl);
        
        //Listen type changing event
        document.querySelector(DOMStrings.type).addEventListener('change', UICtrl.changeTypeEventHandler);
    }

    function updateBudget(){
        //5. Calculate Budget
        var calculatedBudget = budgetCtrl.calculateBudget();

        //6. Show Budget On UI
        UICtrl.displayBudget(calculatedBudget);
    }

    function clickAddEventCtrl(){
        //1. Take input from UI
        var input = UICtrl.getInput();
                
        //2. Add that input into data Structure
        if(input.getDescription !== '' && input.getValue !== '' && !isNaN(input.getValue)){
            var newItem = budgetCtrl.addItem(input);
        
            //3. Create Clear field function
            UICtrl.clearField();

            //4. Add New item on UI
            UICtrl.addItem(newItem, input.getType);

            //5. Update budget on UI
            updateBudget();

            //6. Calulate and display percentages
            calulateAndDisplayPercentages();
        } 
    }

    //Calculate Percentages
    function calulateAndDisplayPercentages(){
        //1. Calculate Percentages and get the calculated percentages
        var percentages = budgetCtrl.getPercentages()
        //3. Display on UI
        UICtrl.displayPercentages(percentages);
        
    }

    //Delete button controller
    function clickDeleteEventCtrl(event){
        
        //1. Delete item from data structure
        var itemID, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            type = itemID.split('-')[0];
            ID = parseInt(itemID.split('-')[1]);
            budgetCtrl.deleteItem(type, ID);
            //2. Update budget on UI
            updateBudget();

            //3. Delete Item from UI
            UICtrl.deleteItem(itemID);
        }      

        //4. Calulate and display percentages
        calulateAndDisplayPercentages();
    }
    
    //function to show month
    UICtrl.showMonth();

    //1. Make a init function
    return{
        init : function(){
            UICtrl.cleanBudgetValues();
            listenEvent();
        }
    }
})(budgetController, UIController);

controller.init();