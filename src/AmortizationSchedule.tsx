import React, { useMemo, useState } from 'react';
import './AmortizationSchedule.css';

type PaymentItem = {
    number: number,
    interest: number,
    principal: number,
    balance: number;
};

export default function AmortizationSchedule() {
    const [principal, setPrincipal] = useState(null);
    const [interest, setInterest] = useState(null);
    const [periods, setPeriods] = useState(null);

    const monthlyPayment = useMemo(() => {
        if (principal > 0 && interest > 0 && periods > 0) {
            const rate = interest / 1200;
            const payments = periods * 12;
            const loanAmount = principal;

            const compoundFactor = Math.pow(1 + (rate), payments);
            const monthly = (loanAmount * compoundFactor * (rate)) / (compoundFactor - 1);

            return monthly;
        }

        return null;

    }, [principal, interest, periods]);


    function AmortizationTable() {
        const payments: PaymentItem[] = [];
        let balance = principal;
        let paymentNumber = 1;
        let totalInterest = 0;

        while (paymentNumber <= periods * 12) {
            const interestPaid = (interest / 1200) * balance;
            totalInterest += interestPaid;
            const principalPaid = monthlyPayment - interestPaid;
            balance -= principalPaid;
            payments.push({ number: paymentNumber, interest: interestPaid, principal: principalPaid, balance });
            paymentNumber++;
        }

        return <>
            <div className="loan-cost-container">
                {!!monthlyPayment &&
                    <div className="loan-cost-information">Monthly payment:&nbsp;
                        <span className="red-text">$
                            {
                                (monthlyPayment).toLocaleString('en', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                        </span>
                    </div>
                }

                {!!totalInterest &&
                    <div className="loan-cost-information">Total loan interest:&nbsp;
                        <span className="red-text">$
                            {
                                (totalInterest).toLocaleString('en', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                        </span>
                    </div>
                }
            </div>
            <div className='amortization-payment-container'>
                <table>
                    <thead>
                        <tr>
                            <td>Payment</td>
                            <td>Interest</td>
                            <td>Principal</td>
                            <td>Balance</td>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((pmt, idx) => {
                            return <tr key={idx} className={`payment-row ${idx % 2 === 0 ? '' : 'gray-background'}`}>
                                <td>{pmt.number}</td>
                                <td>${(pmt.interest).toLocaleString('en', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}</td>
                                <td>${(pmt.principal).toLocaleString('en', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}</td>
                                <td>${(Math.abs(pmt.balance)).toLocaleString('en', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}</td>
                            </tr>;

                        })}
                    </tbody>
                </table>
            </div>
        </>;

    }

    return (<div className="amortization-schedule">
        <div className="amortization-schedule-header">
            <div className="loan-terms-container">
                <div className="loan-term-input">
                    <div className="loan-input-label">Principal: </div>
                    <input id="principal" type="number" step="1000" placeholder='$0' value={principal ?? ''} onChange={(e => setPrincipal(e.target.value))} />
                </div>
                <div className="loan-term-input">
                    <div className="loan-input-label">Interest: </div>
                    <input id="interest" type="number" step="0.01" placeholder='0.00%' value={interest ?? ''} onChange={(e => setInterest(e.target.value))} />
                </div>
                <div className="loan-term-input">
                    <div className="loan-input-label">Term: </div>
                    <input id="periods" type="number" placeholder='0 Years' value={periods ?? ''} onChange={(e => setPeriods(e.target.value))} />
                </div>
            </div>

        </div>

        {!!monthlyPayment && <AmortizationTable />}
    </div>
    );
}