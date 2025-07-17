import { useState } from "react";



function App() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");


    const filteredExpense = selectedCategory === "all" ? expenses : expenses.filter(exp => selectedCategory === exp.category);

    //For total price. filteredExpense is what we are now looping through, so we use it.
    const totalPrice = filteredExpense.reduce((sum, exp) => sum + exp.price,
        0
    );


    function handleAddExpense(newExpense) {
        setExpenses((expenses) => [...expenses, newExpense]);


        if (!categories.includes(newExpense.category)) {
            setCategories((categories) => [...categories, newExpense.category]);
        } else {
            setCategories((categories) => [...categories]);
        }
    }


    function handleDeleteExpense(id) {
        setExpenses((expenses) => {
            const updatedExpenses = expenses.filter(expense => expense.id !== id);

            const updatedCategories = Array.from(new Set(updatedExpenses.map(exp => exp.category)));

            setCategories(updatedCategories);

            return updatedExpenses;
        });
    }


    return (
        <>
            <Header />
            <Form onAddItem={handleAddExpense} />
            <CategoryList categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            <ExpenseList expenses={filteredExpense} onDeleteExpense={handleDeleteExpense} />
            <Footer total={totalPrice} />
        </>

    );
}


function Header() {
    return (
        <h1>Expense Tracker</h1>
    );
}


function Form({ onAddItem }) {
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemCategory, setItemCategory] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        const newExpense = {
            id: Date.now(),
            name: itemName,
            price: Number(itemPrice),
            date: Date.now(),
            category: itemCategory.toLowerCase()
        };

        if (newExpense.name === '') {
            return;
        }

        if (!newExpense.price || newExpense.price < 1) {
            return;
        }

        if (newExpense.category === '') {
            return;
        }

        onAddItem(newExpense)

        setItemName('');
        setItemPrice('');
        setItemCategory('');
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="inputs">
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Enter item name.." />
                <input type="number" value={itemPrice} onChange={(e) => setItemPrice(Number(e.target.value))} placeholder="Enter item price" />
                <input type="text" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} placeholder="Enter item category" />
            </div>
            <div>
                <button>Add Expense</button>
            </div>
        </form>
    );
}

function CategoryList({ categories, selectedCategory, onSelectCategory }) {

    return (
        <div className="select-cat">
            <p>Filter by category:</p>

            <select value={selectedCategory} onChange={(e => onSelectCategory(e.target.value))}>
                <option value="all">all</option>
                {categories.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
            </select>
        </div>
    );
}

function ExpenseList({ expenses, onDeleteExpense }) {
    return (
        <ul className="expenseList">
            {expenses.map((expense) => <Expense expense={expense} key={expense.id} onDeleteExpense={onDeleteExpense} />)}
        </ul>
    );
}

function Expense({ expense, onDeleteExpense }) {
    const TheDate = new Date(expense.date).toLocaleDateString();
    return (
        <li className="expense-item">
            <span>{expense.name}</span>
            <span>${expense.price}</span>
            <span>{TheDate}</span>
            <span>{expense.category}</span>
            <button onClick={() => onDeleteExpense(expense.id)}>Delete</button>
        </li>
    );
}


function Footer({ total }) {
    if (total >= 1000) {
        return (
            <footer>
                <p>You have spent too much this month. Your expenses is at ${total}</p>
            </footer>
        );
    }

    return (
        <footer>
            <p>The total price of your expenses is ${total}</p>
        </footer>
    );
}


export default App;