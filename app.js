const subjectData = {
    science: {
        common: ["Bangla 1st", "Bangla 2nd", "English 1st", "English 2nd", "General Math", "ICT", "Islam & Moral Education"],
        groupBase: ["Physics", "Chemistry", "Bangladesh & World"],
        electives: ["Higher Math", "Biology"], 
        optionalExtra: ["Agriculture Studies", "Home Science"]
    },
    commerce: {
        common: ["Bangla 1st", "Bangla 2nd", "English 1st", "English 2nd", "General Math", "ICT", "Islam & Moral Education"],
        group: ["Finance & Banking", "Accounting", "Business Ent.", "General Science"],
        optional: ["Agriculture Studies", "Home Science", "Music"]
    },
    humanities: {
        common: ["Bangla 1st", "Bangla 2nd", "English 1st", "English 2nd", "General Math", "ICT", "Islam & Moral Education"],
        group: ["Geography", "Civic & Citizenship", "Economics", "History of Bangladesh", "General Science"],
        optional: ["Agriculture Studies", "Home Science", "Music"]
    }
};

let currentGroup = 'science';

// Dynamic Greeting
const hour = new Date().getHours();
const greetEl = document.getElementById('greeting');
if (hour < 12) greetEl.innerText = "Good Morning, Scholar";
else if (hour < 18) greetEl.innerText = "Good Afternoon, Scholar";
else greetEl.innerText = "Good Evening, Scholar";

function switchGroup(group) {
    currentGroup = group;
    document.querySelectorAll('.group-toggle button').forEach(btn => btn.classList.remove('active'));
    
    const targetId = group === 'science' ? 'sciBtn' : group === 'commerce' ? 'comBtn' : 'artsBtn';
    document.getElementById(targetId).classList.add('active');
    
    updateOptionalDropdown(group);
    renderSubjects(); 
}

function handleSubjectSwap() { renderSubjects(); }

function renderSubjects() {
    const grid = document.getElementById('subject-grid');
    const selectedOpt = document.getElementById('opt-name').value;
    grid.innerHTML = '';
    
    let mainList = [];

    if (currentGroup === 'science') {
        mainList = [...subjectData.science.common, ...subjectData.science.groupBase];
        if (selectedOpt === "Biology") {
            mainList.push("Higher Math");
        } else if (selectedOpt === "Higher Math") {
            mainList.push("Biology");
        } else {
            // Default to Biology as main if Agriculture/Home Science is chosen as 4th
            mainList.push("Biology");
        }
    } else {
        mainList = [...subjectData[currentGroup].common, ...subjectData[currentGroup].group];
    }
    
    mainList.forEach(sub => {
        grid.innerHTML += `
            <div class="input-group">
                <label>${sub}</label>
                <input type="number" class="m-input" data-name="${sub}" placeholder="${sub === 'ICT' ? '0-50' : '0-100'}">
            </div>
        `;
    });
}

function updateOptionalDropdown(group) {
    const select = document.getElementById('opt-name');
    select.innerHTML = '';
    let options = group === 'science' ? [...subjectData.science.electives, ...subjectData.science.optionalExtra] : subjectData[group].optional;

    options.forEach(opt => {
        const el = document.createElement('option');
        el.value = opt;
        el.textContent = opt;
        select.appendChild(el);
    });
}

function getGP(marks) {
    if (marks >= 80) return 5.0;
    if (marks >= 70) return 4.0;
    if (marks >= 60) return 3.5;
    if (marks >= 50) return 3.0;
    if (marks >= 40) return 2.0;
    if (marks >= 33) return 1.0;
    return 0.0;
}

function runEngine() {
    const inputs = document.querySelectorAll('.m-input');
    let marksMap = {};
    inputs.forEach(i => marksMap[i.dataset.name] = Number(i.value) || 0);

    const bnAvg = (marksMap["Bangla 1st"] + marksMap["Bangla 2nd"]) / 2;
    const enAvg = (marksMap["English 1st"] + marksMap["English 2nd"]) / 2;

    let points = [getGP(bnAvg), getGP(enAvg)];
    let fail = (getGP(bnAvg) === 0 || getGP(enAvg) === 0);

    for (let s in marksMap) {
        if (!s.includes("Bangla") && !s.includes("English")) {
            let m = (s === "ICT") ? marksMap[s] * 2 : marksMap[s]; 
            let gp = getGP(m);
            if (gp === 0) fail = true;
            points.push(gp);
        }
    }

    const optMarks = Number(document.getElementById('opt-marks').value) || 0;
    const optGP = getGP(optMarks);
    const bonus = optGP > 2 ? optGP - 2 : 0;

    let gpa = (points.reduce((a, b) => a + b, 0) + bonus) / points.length;
    if (gpa > 5) gpa = 5.0;
    if (fail) gpa = 0.0;

    const display = document.getElementById('result-display');
    display.style.display = 'block';
    document.getElementById('gpa-score').innerText = gpa.toFixed(2);
    
    const status = document.getElementById('grade-status');
    status.innerText = fail ? "Failed (F)" : (gpa >= 5 ? "Golden A+" : "Successful");
    status.style.color = fail ? "#f43f5e" : "#10b981";

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

switchGroup('science');