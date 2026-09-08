import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function analyzeLoan({ loanAmount, creditScore, monthlyIncome }) {
  const checks = [
    {
      key: 'creditScore',
      label: 'Credit score',
      passed: creditScore >= 650,
      detail: creditScore >= 650 ? 'Meets the 650 minimum' : 'Below the 650 minimum'
    },
    {
      key: 'monthlyIncome',
      label: 'Monthly income',
      passed: monthlyIncome >= 2500,
      detail: monthlyIncome >= 2500 ? 'Meets the $2,500 minimum' : 'Below the $2,500 minimum'
    },
    {
      key: 'loanToIncome',
      label: 'Loan-to-income fit',
      passed: loanAmount <= monthlyIncome * 8,
      detail: loanAmount <= monthlyIncome * 8 ? 'Loan is within 8x monthly income' : 'Loan is above 8x monthly income'
    }
  ];

  const approved = checks.every((check) => check.passed);
  const passedCount = checks.filter((check) => check.passed).length;

  return {
    decision: approved ? 'approved' : 'rejected',
    score: Math.round((passedCount / checks.length) * 100),
    checks,
    summary: approved
      ? 'This application meets all three assessment checkpoints.'
      : 'This application needs a stronger profile before it can be approved.'
  };
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.post('/api/analyze', (request, response) => {
  const { loanAmount, creditScore, monthlyIncome } = request.body;
  const values = [loanAmount, creditScore, monthlyIncome];

  if (values.some((value) => typeof value !== 'number' || !Number.isFinite(value) || value <= 0)) {
    return response.status(400).json({ error: 'Enter positive numbers for all three fields.' });
  }

  if (creditScore > 850) {
    return response.status(400).json({ error: 'Credit score must be between 1 and 850.' });
  }

  return response.json(analyzeLoan({ loanAmount, creditScore, monthlyIncome }));
});

app.listen(port, () => {
  console.log(`LoanLens API running on http://localhost:${port}`);
});
