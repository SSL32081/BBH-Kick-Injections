console.log("Welcome aboard")

// To whoever reading this, please bare in mind that every character here 
// was typed and tested for every single desired feature in the main html.
// Therefore, even though the whole piece look short, sweet and simple; 
// it took the author almost a full day to curate this as an HTML newbie :)
// Ofc, he would very much love to hear any smarter ways to achieve the same goals.

const input_base = "src/";
const Qs = [1.5, 3.0];

function construct_label(spin, q) {
    if (q == 1.5) {
        var qname = "Q1p5";
    } else {
        var qname = "Q3p0";
    }
    return `spin${spin}_${qname}`
}

class SpinQ_Config {
    constructor(spin, q) {
        this.spin = spin
        this.q = q
        this.label = construct_label(spin, q)
        this.title = `Spin ${spin}, Q ${q}`
        this.statstable_link = this.srcUrl("stats")
        this.kickplot_link = this.srcUrl("kick")
        this.contours_link = this.srcUrl("contour")
    }

    srcUrl(type) {
        switch(type) {
            case 'stats':
                return `${input_base}tex_tables/${this.label}_2Dskyloc_tex_table.txt`;
                break;
            case 'kick':
                return `${input_base}kick_plots/${this.label}_2Dskyloc_kick.html`;
                break;
            case 'contour':
                return `${input_base}contour_png/${this.label}_2Dskyloc_all_plots.png`;
                break;
        }
    }
}

const spinDropdown = document.createElement('select');
spinDropdown.id = "spinDrop";
spinDropdown.onchange = scrollSection;
const qDropdown = document.createElement('select');
qDropdown.id = "qDrop";
qDropdown.onchange = scrollSection;

function initialise() {
    var test_config = new SpinQ_Config(0, 1.5)

    Qs.forEach((q) => {
        var opt = document.createElement('option');
        opt.value = q;
        opt.innerHTML = q;
        qDropdown.appendChild(opt); 
    })


    for(var spin = 0; spin < 10; spin += 1) {
        var opt = document.createElement('option');
        opt.value = spin;
        opt.innerHTML = spin;
        spinDropdown.appendChild(opt);

        Qs.forEach((q) => {
            var new_config = new SpinQ_Config(spin, q);
            const section = document.createElement('div');
            section.className = "section";
            section.id = new_config.label;
            section.innerHTML = `<h3 class="sec-header">${new_config.title}</h3>`

            const upperhalf = document.createElement('div');
            upperhalf.className = 'upper_half';

            const table = document.createElement('div');
            table.className = "table";
            const tableContent = readHTML(new_config.statstable_link);
            table.innerHTML = tableContent ;
            // + "<p>Table showing the median and 90% C.I. of each parameters.</p>";
            
            const kickplot = document.createElement('div');
            // kickplot.innerHTML = 'Now it is gone :(';
            kickplot.innerHTML = '';
            // const kickplot = document.createElement('iframe');
            // kickplot.className = 'kickplot';
            // kickplot.id = 'igraph';
            // kickplot.scrolling = 'no';
            // kickplot.style = 'border:none';
            // kickplot.seamless = 'seamless';
            // kickplot.src = new_config.kickplot_link;
            // kickplot.height = '900';
            // kickplot.width = '65%';

            upperhalf.appendChild(table);
            upperhalf.appendChild(kickplot);

            const cont_sec = document.createElement('div');
            cont_sec.className = 'mainplots'
            const cont_plot = document.createElement('img');
            cont_plot.src = new_config.contours_link;
            cont_sec.appendChild(cont_plot);

            section.appendChild(upperhalf);
            section.appendChild(cont_sec);
            document.getElementById("ShowcaseRoom").appendChild(section);
        })
    }    
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    
    const dropDownSec = document.createElement('div');
    dropDownSec.id = 'dropDownSec';
    const spinText = document.createTextNode('Spin Index: ');
    const qText = document.createTextNode('Mass ratio: ');
    dropDownSec.appendChild(spinText);
    dropDownSec.appendChild(spinDropdown);
    dropDownSec.appendChild(qText);
    dropDownSec.appendChild(qDropdown);
    document.getElementById("header").appendChild(dropDownSec);
}

function readHTML(file) {
    // I have zero idea how this work: https://stackoverflow.com/a/22151496
    var reader = new XMLHttpRequest();
    reader.open('get', file, false);
    reader.send(null);
    const content = reader.responseText.toString();
    console.log(content);
    return content;
}

function scrollSection() {
    var spinSelect = document.getElementById('spinDrop');
    var spin_val = spinSelect[spinSelect.selectedIndex].value;
    var qSelect = document.getElementById('qDrop');
    var q_val = qSelect[qSelect.selectedIndex].value;
    var label = construct_label(spin_val, q_val);
    console.log(label);
    $('body,html').animate({ scrollTop: $('#'+label).position().top });

}
