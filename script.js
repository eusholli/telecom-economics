document.addEventListener('DOMContentLoaded', () => {
    const currentInputs = document.querySelectorAll('.input-group:first-child input[type="number"]');
    const newInputs = document.querySelectorAll('.input-group:last-child input[type="number"]');
    const generateBtn = document.getElementById('generateBtn');
    const operatorNameInput = document.getElementById('operatorName');
    const simulatorTitle = document.getElementById('simulatorTitle');
    let chart;

    // Set initial title
    updateTitle();

    // Set initial value for "New Wanted Growth Rate of New Users (%)"
    const newGrowthRateInput = document.getElementById('newGrowthRate');
    if (newGrowthRateInput) {
        newGrowthRateInput.value = 2;
    }

    currentInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            newInputs[index].value = input.value;
        });
    });

    operatorNameInput.addEventListener('input', updateTitle);

    generateBtn.addEventListener('click', generateGraph);

    // Generate graph on page load
    generateGraph();

    function updateTitle() {
        const operatorName = operatorNameInput.value.trim();
        if (operatorName) {
            simulatorTitle.textContent = `${operatorName} Telecom Economics Simulator`;
        } else {
            simulatorTitle.textContent = 'Telecom Economics Simulator';
        }
    }

    function generateGraph() {
        const currentValues = getInputValues('');
        const newValues = getInputValues('new');

        if (!validateInputs(currentValues) || !validateInputs(newValues)) {
            alert('Please fill in all fields with valid numbers.');
            return;
        }

        const currentData = calculateProfit(currentValues);
        const newData = calculateProfit(newValues);

        const ctx = document.getElementById('profitChart');
        if (!ctx) {
            console.error('Canvas element not found');
            return;
        }

        if (chart) {
            chart.destroy();
        }

        const allData = [...currentData, ...newData];
        const minProfit = Math.min(...allData);
        const maxProfit = Math.max(...allData);
        const buffer = (maxProfit - minProfit) * 0.1; // 10% buffer

        const yAxisLabel = getYAxisLabel(maxProfit);
        const yAxisTickCallback = getYAxisTickCallback(maxProfit);

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => `Month ${i + 1}`),
                datasets: [
                    {
                        label: 'Current Values',
                        data: currentData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1
                    },
                    {
                        label: 'New Values',
                        data: newData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: minProfit - buffer,
                        suggestedMax: maxProfit + buffer,
                        title: {
                            display: true,
                            text: yAxisLabel
                        },
                        ticks: {
                            callback: yAxisTickCallback
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Months'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatCurrency(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });

        // Calculate and display total profit difference
        const currentTotalProfit = currentData.reduce((sum, profit) => sum + profit, 0);
        const newTotalProfit = newData.reduce((sum, profit) => sum + profit, 0);
        const profitDifference = newTotalProfit - currentTotalProfit;

        const profitSummaryElement = document.getElementById('profitSummary');
        profitSummaryElement.innerHTML = `
            <div class="profit-summary">
                <h3>Total Profit Summary (24 Months)</h3>
                <p>Current Strategy: ${formatCurrency(currentTotalProfit)}</p>
                <p>New Strategy: ${formatCurrency(newTotalProfit)}</p>
                <p class="profit-difference ${profitDifference >= 0 ? 'positive' : 'negative'}">
                    Difference: ${formatCurrency(profitDifference)} (${profitDifference >= 0 ? 'Gain' : 'Loss'})
                </p>
            </div>
        `;
    }

    function getInputValues(prefix) {
        const inputs = ['totalUsers', 'churnRate', 'arpu', 'cac', 'growthRate'];
        const values = {};

        for (const input of inputs) {
            const elementId = prefix ? `${prefix}${input.charAt(0).toUpperCase() + input.slice(1)}` : input;
            const element = document.getElementById(elementId);
            if (!element) {
                console.error(`Input element ${elementId} not found`);
                return null;
            }
            values[input] = parseFloat(element.value);
        }

        values.churnRate /= 100;
        values.growthRate /= 100;

        return values;
    }

    function validateInputs(values) {
        if (!values) return false;
        return Object.values(values).every(value => !isNaN(value) && isFinite(value));
    }

    function calculateProfit(values) {
        if (!values) return [];

        let { totalUsers, churnRate, arpu, cac, growthRate } = values;
        const profits = [];

        for (let month = 0; month < 24; month++) {
            const churnedUsers = Math.round(totalUsers * churnRate);
            const newUsers = Math.round(totalUsers * growthRate);
            const revenue = totalUsers * arpu;
            const acquisitionCost = newUsers * cac;
            const profit = revenue - acquisitionCost;

            profits.push(profit);

            totalUsers = totalUsers - churnedUsers + newUsers;
        }

        return profits;
    }

    function getYAxisLabel(maxProfit) {
        if (maxProfit >= 1e9) {
            return 'Profit (Billions USD)';
        } else if (maxProfit >= 1e6) {
            return 'Profit (Millions USD)';
        } else {
            return 'Profit (USD)';
        }
    }

    function getYAxisTickCallback(maxProfit) {
        if (maxProfit >= 1e9) {
            return function(value) {
                return '$' + (value / 1e9).toFixed(1) + 'B';
            };
        } else if (maxProfit >= 1e6) {
            return function(value) {
                return '$' + (value / 1e6).toFixed(1) + 'M';
            };
        } else {
            return function(value) {
                return '$' + value.toFixed(0);
            };
        }
    }

    function formatCurrency(value) {
        if (Math.abs(value) >= 1e9) {
            return '$' + (value / 1e9).toFixed(2) + ' Billion';
        } else if (Math.abs(value) >= 1e6) {
            return '$' + (value / 1e6).toFixed(2) + ' Million';
        } else {
            return '$' + value.toFixed(2);
        }
    }
});
