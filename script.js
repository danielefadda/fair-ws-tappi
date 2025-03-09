const script = document.createElement('script');
script.src = 'https://d3js.org/d3.v7.min.js';
script.onload = () => {
    // D3 code with semicolon as the delimiter
    d3.dsv(';', 'data/schedule.csv').then(data => {
        console.log(data);

        data= data.filter(d => d.Type !== 'Talk');

        const container = d3.select('#app');

        const slideContainers = container.selectAll('.slide-container')
            .data(data)
            .join('div')
            .attr('class', 'slide-container');

        const slides = slideContainers.append('div')
            .attr('class', d => `slide ${d.Type.toLowerCase()}`);

        slides.append('img')
            .attr('src', 'img/fair_banner.png')
            .attr('alt', 'Fair Banner')
            .attr('class', 'header-img');

        const headers = slides.append('div')
            .attr('class', 'header');

        headers.append('h1')
            .html(d => `${d.Title}`);

        slides.filter(d => d.Type === 'Break')
            .append('div')
            .attr('class', 'time')
            .text(d => `${d.Start_Time} - ${d.End_Time}`);

        const contents = slides.append('div')
            .attr('class', 'content');

        const descriptions = contents.append('div')
            .attr('class', 'description');

        descriptions.append('p')
            .html(d => d.Speakers);

        descriptions.append('div')
            .html(d => (d.Affiliations !== '[]')? d.Affiliations.replaceAll("'","").replaceAll('[','').replaceAll(']',''): '');

        slides.append('div')
            .attr('class', 'type-badge')
            .text(d => d.Talk_ID ? `${d.Type} ${d.Talk_ID}` : `${d.Type} ${d.WP_Number}`);

        slides.append('div')
            .attr('class', 'footer');

        // Update slideContainers after D3 code
        const slideContainersDOM = document.querySelectorAll('.slide-container');

        let currentIndex = 0;

        window.showSlide = function(index) {
            slideContainersDOM.forEach((container, i) => {
                container.style.display = i === index ? 'block' : 'none';
            });
        };

        window.nextSlide = function() {
            // Se non siamo già all'ultima slide, vai alla prossima
            if (currentIndex < slideContainersDOM.length - 1) {
                currentIndex += 1;
                showSlide(currentIndex);
            }
        };

        window.prevSlide = function() {
            // Se non siamo già alla prima slide, vai alla precedente
            if (currentIndex > 0) {
                currentIndex -= 1;
                showSlide(currentIndex);
            }
        };

        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') {
                prevSlide();
            } else if (event.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Show the first slide at the beginning
        showSlide(0);
    }).catch(error => {
        console.error('Error loading the CSV file:', error);
    });
};
document.head.appendChild(script);