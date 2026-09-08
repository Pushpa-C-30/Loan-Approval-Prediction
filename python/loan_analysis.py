"""LoanLens approval rules in Python.

The production app uses server/index.js. This module mirrors the same rules
for Python integrations, scripts, or future model experiments.
"""


def analyze_loan(loan_amount: float, credit_score: float, monthly_income: float) -> dict:
    """Return an approval decision and transparent checkpoint details."""
    if loan_amount <= 0 or credit_score <= 0 or monthly_income <= 0:
        raise ValueError("Enter positive numbers for all three fields.")
    if credit_score > 850:
        raise ValueError("Credit score must be between 1 and 850.")

    checks = [
        {
            "key": "creditScore",
            "label": "Credit score",
            "passed": credit_score >= 650,
            "detail": "Meets the 650 minimum" if credit_score >= 650 else "Below the 650 minimum",
        },
        {
            "key": "monthlyIncome",
            "label": "Monthly income",
            "passed": monthly_income >= 2500,
            "detail": "Meets the $2,500 minimum" if monthly_income >= 2500 else "Below the $2,500 minimum",
        },
        {
            "key": "loanToIncome",
            "label": "Loan-to-income fit",
            "passed": loan_amount <= monthly_income * 8,
            "detail": "Loan is within 8x monthly income"
            if loan_amount <= monthly_income * 8
            else "Loan is above 8x monthly income",
        },
    ]

    passed_count = sum(check["passed"] for check in checks)
    approved = passed_count == len(checks)
    return {
        "decision": "approved" if approved else "rejected",
        "score": round((passed_count / len(checks)) * 100),
        "checks": checks,
        "summary": (
            "This application meets all three assessment checkpoints."
            if approved
            else "This application needs a stronger profile before it can be approved."
        ),
    }


if __name__ == "__main__":
    print(analyze_loan(24000, 724, 5200))
