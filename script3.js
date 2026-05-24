// 1. Stan aktywności scenariuszy
const activeScenarios = {
    pit: false, cit: false, spadki: false, pcc: false, rolny: false,
    lesny: false, nieruchomosci: false, transport: false, tonaz: false,
    kopaliny: false, okretowy: false, finanse: false, detal: false,
    belka: false, vat: false, akcyza: false, gry: false
};

const taxRates = {
    pit: 0.12, cit: 0.19, spadki: 0.12, pcc: 0.02, rolny: 0.025,
    lesny: 0.012, nieruchomosci: 0.01, transport: 0.03, tonaz: 0.005,
    kopaliny: 0.05, okretowy: 0.01, finanse: 0.0044, detal: 0.008,
    belka: 0.19, vat: 0.23, akcyza: 0.35, gry: 0.12
};

// Elementy DOM
const slider = document.getElementById('simulation-amount');
const amountDisplay = document.getElementById('amount-val');
const scenarioCards = document.querySelectorAll('.scenario-card');

// OBSŁUGA ZAKŁADEK
const btnSymulator = document.getElementById('btn-symulator');
const btnDekoder = document.getElementById('btn-dekoder');
const viewSymulator = document.getElementById('view-symulator');
const viewDekoder = document.getElementById('view-dekoder');

btnSymulator.addEventListener('click', () => {
    btnSymulator.classList.add('active');
    btnDekoder.classList.remove('active');
    viewSymulator.classList.add('active-view');
    viewDekoder.classList.remove('active-view');
});

btnDekoder.addEventListener('click', () => {
    btnDekoder.classList.add('active');
    btnSymulator.classList.remove('active');
    viewDekoder.classList.add('active-view');
    viewSymulator.classList.remove('active-view');
    decodeTaxes(); // Przelicz dekoder od razu po otwarciu
});

// Suwak
if(slider) {
    slider.addEventListener('input', function() {
        amountDisplay.innerText = this.value;
        recalculateAll();
    });
}

// Klikanie scenariuszy
scenarioCards.forEach(card => {
    card.addEventListener('click', function() {
        const id = this.getAttribute('data-scenario');
        activeScenarios[id] = !activeScenarios[id];
        
        if (activeScenarios[id]) this.classList.add('active');
        else this.classList.remove('active');

        const taxCard = document.getElementById(`tax-${id}`);
        if (taxCard) {
            if (activeScenarios[id]) taxCard.classList.add('active-tax');
            else taxCard.classList.remove('active-tax');
        }
        recalculateAll();
    });
});

// Funkcja kalkulacyjna Symulatora
function recalculateAll() {
    const amount = parseFloat(slider.value);
    let activeCount = 0;
    let totalTaxSum = 0;

    for (let key in activeScenarios) {
        const isActivated = activeScenarios[key];
        const calcElement = document.getElementById(`calc-${key}`);
        
        if (isActivated) {
            activeCount++;
            let calculatedTax = 0;

            if (key === 'pit') {
                if (amount <= 30000) calculatedTax = 0;
                else if (amount <= 120000) calculatedTax = (amount - 30000) * 0.12;
                else calculatedTax = ((120000 - 30000) * 0.12) + ((amount - 120000) * 0.32);
            } else {
                calculatedTax = amount * taxRates[key];
            }

            totalTaxSum += calculatedTax;
            
            if (calcElement) {
                if (key === 'pit' && amount <= 30000) calcElement.innerText = "Kwota wolna!";
                else calcElement.innerText = calculatedTax.toFixed(2) + " zł";
            }
        } else {
            if (calcElement) calcElement.innerText = "0.00 zł";
        }
    }

    document.getElementById('active-taxes-count').innerText = `${activeCount} / 17`;
    document.getElementById('estimated-total').innerText = totalTaxSum.toFixed(2) + " zł";
}

// LOGIKA DEKODERA
const decoderInput = document.getElementById('decoder-amount');
if(decoderInput) {
    decoderInput.addEventListener('input', decodeTaxes);
}

function decodeTaxes() {
    const val = parseFloat(decoderInput.value) || 0;

    // 1. DEKODOWANIE VAT
    const vatNetto = val / 1.23;
    const ukrytyVat = val - vatNetto;

    document.getElementById('decode-vat-result').innerText = ukrytyVat.toFixed(2) + " zł";
    document.getElementById('decode-vat-netto').innerText = vatNetto.toFixed(2);

    // 2. DEKODOWANIE PIT
    let odliczonyPit = 0;
    if (val > 30000) {
        if (val <= 120000) {
            odliczonyPit = (val - 30000) * 0.12;
        } else {
            odliczonyPit = ((120000 - 30000) * 0.12) + ((val - 120000) * 0.32);
        }
    }
    const pitNetto = val - odliczonyPit;

    document.getElementById('decode-pit-result').innerText = odliczonyPit.toFixed(2) + " zł";
    document.getElementById('decode-pit-netto').innerText = pitNetto.toFixed(2);
}

// Start
recalculateAll();