import React, { useMemo, useState } from 'react';
import './AmortizationSchedule.css'

type PaymentItem = {
    number: number,
    interest: number,
    principal: number,
    balance: number
}

export default function AmortizationSchedule() {
    const [principal, setPrincipal] = useState(null);
    const [interest, setInterest] = useState(null);
    const [periods, setPeriods] = useState(null);

    const monthlyPayment = useMemo(() => {
        if (!principal || !interest || !periods) return null;
        const rate = interest / 1200;
        const payments = periods * 12;
        const loanAmount = principal;

        const compoundFactor = Math.pow(1 + (rate), payments);
        const monthly = (loanAmount * compoundFactor * (rate)) / (compoundFactor - 1);

        return monthly;

    }, [principal, interest, periods])


    function AmortizationTable() {
        const payments: PaymentItem[] = [];
        let balance = principal;
        let paymentNumber = 1;

        while (paymentNumber <= periods * 12) {
            const interestPaid = (interest / 1200) * balance;
            const principalPaid = monthlyPayment - interestPaid;
            balance -= principalPaid;
            payments.push({number: paymentNumber, interest: interestPaid, principal: principalPaid, balance});
            paymentNumber++;
        }

        return <table>
            <tr style={{fontWeight: 'bold', borderBottom: '1px solid black', marginBottom: '1px'}}>
                <td>Payment #</td>
                <td>Interest</td>
                <td>Principal</td>
                <td>Remaining Balance</td>
            </tr>
            {payments.map(pmt => {
                return <tr>
                    <td>{pmt.number}</td>
                    <td>{(pmt.interest).toFixed(2)}</td>
                    <td>{(pmt.principal).toFixed(2)}</td>
                    <td>{(pmt.balance).toFixed(2)}</td>
                </tr>
                
            })}
        </table>;
    }

    return (<div className="amortization-schedule">
        <label htmlFor="principal">Loan amount:
            <input id="principal" type="number" placeholder='Enter principal amount' value={principal} onChange={(e => setPrincipal(e.target.value))} />
        </label>
        <label htmlFor="interest">Interest rate:
            <input id="interest" type="number" placeholder='Enter interest rate' value={interest} onChange={(e => setInterest(e.target.value))} />
        </label>
        <label htmlFor="periods">Loan duration:
            <input id="periods" type="number" placeholder='Enter loan duration in years' value={periods} onChange={(e => setPeriods(e.target.value))} />
        </label>

        {monthlyPayment && <div className="monthly-payment">Monthly payment: {(monthlyPayment).toFixed(2)}</div>}

        {monthlyPayment && <AmortizationTable />}
    </div>
    )
}