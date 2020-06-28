//Javascript Code for Budget application
var budgetController = (function(){

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.itemPercentage = itemPercentage;
    }

    var data = {
        allItems : {
            exp : [],
            inc : []
        },

        totalInc : {
            exp : 0,
            inc : 0
        },

        budget : 0,

        percentage : 0
    };

    var addItem = function(type, description, value){
        if(data.allItems[type].length > 0)
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        else
            ID = 0;
        if(type === 'exp'){
            newItem = new Expense(ID, description, value);
            data.allItems.exp.push(newItem);
            data.totalInc.exp = data.totalInc.exp + value;
        }
        
        else{
            newItem = new Income(ID, description, value);
            data.allItems.inc.push(newItem);
            data.totalInc.inc = data.totalInc.inc + value;
        }

        return newItem;
    }

    return{
        addItem : function(type, description, value){
            return addItem(type, description, value);
        },

        calculateBudget : function(){
            data.budget = data.totalInc.inc - data.totalInc.exp;
            if(data.totalInc.inc > 0){
                data.percentage = Math.round((data.totalInc.exp * 100) / data.totalInc.inc);
            }
            else{
                data.percentage = -1;
            }
        },

        getBudget : function(){
            return{
                income : data.totalInc.inc,
                expense : data.totalInc.exp,
                budegt : data.budget,
                percentage : data.percentage
            }
        },

        testing : function(){
            console.log(data);
        }
    }
    
})();


var UIController = (function(){


    var DOMStrings = {
        type : '.add__type',
        description : '.add__description',
        value : '.add__value',
        addButton : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetValue : '.budget__value',
        totalIncome : '.budget__income--value',
        totalExpense : '.budget__expenses--value',
        percentage : '.budget__expenses--percentage',
        itemPercentage : '.item__percentage'
    }
    
    return {
        getInput : function(){
            return{
                getType : document.querySelector(DOMStrings.type).value,
                getDescription : document.querySelector(DOMStrings.description).value,
                getValue : parseFloat(document.querySelector(DOMStrings.value).value)
            }
        },

        displayBudget : function(budget){
            document.querySelector(DOMStrings.totalIncome).textContent = '+ ' + budget.income;
            
            if(budget.budegt > 0){
                document.querySelector(DOMStrings.budgetValue).textContent = '+ Rs.' + budget.budegt;
            }
            else if(budget.budegt < 0){
                document.querySelector(DOMStrings.budgetValue).textContent = '- Rs.' + budget.budegt;
            }
            else{
                document.querySelector(DOMStrings.budgetValue).textContent = '0';
            }            
            
            if(budget.expense > 0){
                document.querySelector(DOMStrings.totalExpense).textContent = '- ' + budget.expense;
            }               
            else if(budget.expense <= 0){
                document.querySelector(DOMStrings.totalExpense).textContent = '0';
            }

            if(budget.percentage > 0){
                document.querySelector(DOMStrings.percentage).textContent = budget.percentage + '%';
            }                
            else if(budget.percentage <= 0){
                document.querySelector(DOMStrings.percentage).textContent = '--';
            }                
        },

        addItemList : function(obj, type){
            var html, newHtml, element;
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type === 'exp'){
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace the placeholders
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //Insert into HTML DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields : function(){
            fields = document.querySelectorAll(DOMStrings.description + ', ' + DOMStrings.value);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = '';
            });

            document.querySelector(DOMStrings.type).value = 'inc';
            fieldsArr[0].focus();
        },

        getDOMStrings : function(){
            return DOMStrings;
        }
    }

})();



var controller = (function(budgetCtrl, UICtrl){

    var DOMStrings = UICtrl.getDOMStrings();


    var setupEventListner = function(){
        document.querySelector(DOMStrings.addButton).addEventListener('click', addItemController);


        document.addEventListener('keypress', function(event){
            if(event.code === 'Enter' || event.keyCode === 13 || event.which === 13){
                addItemController();
            }            
        });
    }
    
    var updateBudget = function(){
        // 1. Calculate Budget
        budgetCtrl.calculateBudget();
        // 2. return budget
        var budget = budgetCtrl.getBudget();
        // 3. Show budget on UI
        UICtrl.displayBudget(budget);
    }

    var addItemController = function(){
        // 1. Get the input
        var input = UICtrl.getInput();
        
        if(input.getDescription !== '' && !isNaN(input.getValue) && input.getValue > 0){
            // 2. add item to the budgetController
            
            var newItem = budgetCtrl.addItem(input.getType, input.getDescription, input.getValue);
            
            // 3. add item on UI
            UICtrl.addItemList(newItem, input.getType);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate & Update Budget
            updateBudget();

        }               
    }


    return{
        init : function(){
            setupEventListner();
        }
    }

})(budgetController, UIController);


controller.init();