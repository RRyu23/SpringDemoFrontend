import React, {useState} from 'react';

function TransactionPage() {
    const baseURL = "http://localhost:8080/api";
    const [amount, setAmount] = useState(0);
    const [transactions, setTransactions] = useState([]);

    function handleAmountChange(event) {
        setAmount(event.target.value);
    }

    function getDate(date) {
        const Y = date.getFullYear();
        const M = date.getMonth() + 1;
        const D = date.getDate();
        return Y + (M < 10 ? "-0" : "-") + M + (D < 10 ? "-0" : "-") + D;
    }

    async function handleTransactionSubmit(event) {
        event.preventDefault();
        let URL = baseURL + "/transaction?token=";
        const date = new Date();
        // const Y = date.getFullYear();
        // const M = date.getMonth() + 1;
        // const D = date.getDate();
        // var times = Y + (M < 10 ? "-0" : "-") + M + (D < 10 ? "-0" : "-") + D;
        let newTransaction = {
            "customerId" : localStorage.getItem("customerId"),
            "amount" : amount,
            "date" : getDate(date),
        };
        URL += localStorage.getItem("token")
        await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
            },
            body: JSON.stringify(newTransaction),
        }).then((response)=>{
            if(!response.ok){
                throw new Error("Please try again");
            }
            return response.json()
        }).then((data)=>{
            console.log(data);
            newTransaction["reward"] = data.body.reward;
            newTransaction["id"] = data.body.id;
        })
        // setTransactions([newTransaction, ...transactions]);
    }

    async function handleTransactionDelete(id) {
        const URL = baseURL + "/transaction/" + id + "?token=" + localStorage.getItem("token")
        await fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
            },
        })
        await handleTransactionsHistory();
    }

    async function handleTransactionsHistory(){
        const newTransactions = [];
        let URL = baseURL + "/transactions/" + localStorage.getItem("customerId") + "?token=" + localStorage.getItem("token");
        await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
            },
        }).then((response)=>{
            if(!response.ok){
                throw new Error("Please try again!");
            }
            return response.json();
        }).then((data)=>{
            for(let i=0; i<data.body.length; i++){
                let record = data.body[i];
                const newTransaction = {
                    "id": record["id"],
                    "amount": record["amount"],
                    "date": getDate(new Date(record["date"])),
                    "reward": record["reward"],
                }
                newTransactions.push(newTransaction);
            }
            setTransactions(newTransactions);
        })
    }

    async function handleReward() {
        const URL = baseURL + "/reward/" + localStorage.getItem("customerId") + "?token=" + localStorage.getItem("token");
        await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
            },
        }).then((response)=>{
            if(!response.ok){
                throw new Error("Please try again!");
            }
            return response.json();
        }).then((data)=>{
            document.getElementById("reward").innerHTML = " Recent reward in one month is: " + data.body.reward;
        })
    }

    return (
        <div>
            <h2>Transaction</h2>
            <form onSubmit={handleTransactionSubmit}>
                <label>
                    Amount:
                    <input type="number" value={amount} onChange={handleAmountChange} />
                </label>
                <button type="submit">Submit</button>
            </form>
            <button onClick={handleTransactionsHistory}> Check My Transactions History</button>
            <table>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Reward</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                        <td>{transaction.date}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.reward}</td>
                        <td>
                            <button onClick={()=>handleTransactionDelete(transaction.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <br />
            <button onClick={handleReward}> Check My Recent Reward</button>
            <span id="reward"></span>
        </div>
    );
}

export default TransactionPage;
