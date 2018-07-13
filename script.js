function DrawingCard(arrayLenth) {
    this.aryLen = arrayLenth;
    var randomArray = new Array(this.aryLen);
    for (var i = 0; i < randomArray.length; i++) {
        randomArray[i] = i;
    }
    function shuffle(array) {
        var len = array.length, ranNum, temp;
        while (len > 0) {
            ranNum = Math.floor(Math.random() * len--);
            temp = array[len];
            array[len] = array[ranNum];
            array[ranNum] = temp;
        }
    }
    shuffle(randomArray)


    this.randomArray = randomArray;
    this.remaining = randomArray.length;
    this.next = function () {
        var returnNumber = randomArray[--this.remaining];
        if (this.remaining === 0) {
            shuffle(randomArray);
            this.remaining = randomArray.length;
        }
        return returnNumber;
    }
}




var width = document.body.clientWidth;
var height = window.innerHeight;
var svg = d3.select('#div').append('svg')
    .attr('width', width)
    .attr('height', height);

var rectSize = 10;
var wCount = Math.floor(width / rectSize);
var hCount = Math.floor(height / rectSize);
var totalRect = wCount * hCount;
var cards = new DrawingCard(totalRect);

var colorScale = d3.scaleLinear()
    .domain(d3.extent(cards.randomArray))
    .range(['red', 'blue'])

function Color() {
    this.r = Math.floor(Math.random() * 255);
    this.g = Math.floor(Math.random() * 255);
    this.b = Math.floor(Math.random() * 255);
    this.color = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',0.8)';
}

var delay = 1;
var elements = []
svg.selectAll('rect')
    .data(cards.randomArray)
    .enter()
    .append('rect')
    .attr('width', rectSize * 0.9)
    .attr('height', rectSize * 0.9)
    .attr('x', function (d, i) {
        return (i % wCount) * rectSize
    })
    .attr('y', function (d, i) {
        return (Math.floor(i / wCount)) * rectSize
    })
    .style('fill', function (d) {
        return new Color().color
    })
    .style('opacity', 0)
    .each(function(d,i){
        elements.push(d3.select(this))
    })


for(var i =0; i<totalRect;i++){
    setTimeout(function(){
        elements[cards.next()].style('opacity',1)
    },i*delay)
}
