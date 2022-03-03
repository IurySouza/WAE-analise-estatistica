const ctxPesticideExposed = document.getElementById('pesticide_exposed').getContext('2d');
const myChart1 = new Chart(ctxPesticideExposed, {
    type: 'bar',
    data: {
        labels,
        datasets: [{
            data: data.pesticide_exposed,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        maxBarThickness: 60,
        plugins: {
            title: {
                display: true,
                text: title_g,
                font: {
                    size: 16,
                }
            },
            subtitle: {
                display: true,
                text: 'Exposto a pesticida'
            },
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                min: 0,
                max: data.greaterValue,
                ticks: {
                    stepSize: 10
                }
            }
        }
    }
});

const ctxPesticideUnexposed = document.getElementById('pesticide_unexposed').getContext('2d');
const myChart2 = new Chart(ctxPesticideUnexposed, {
    type: 'bar',
    data: {
        labels,
        datasets: [{
            data: data.pesticide_unexposed,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        maxBarThickness: 60,
        plugins: {
            title: {
                display: true,
                text: title_g,
                font: {
                    size: 16,
                }
            },
            subtitle: {
                display: true,
                text: 'Não exposto a pesticida'
            },
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                min: 0,
                max: data.greaterValue,
                ticks: {
                    stepSize: 10
                }
            }
        }
    }
});