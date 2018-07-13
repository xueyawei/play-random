var isMobil = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
var time = isMobil ? 10 : 3 //second

function DrawingCard(arrayLenth, isLoop) {
    this.isLoop = isLoop
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
    this.endFlag = false;
    this.next = function () {
        if (!this.endFlag) {
            var returnNumber = randomArray[--this.remaining];
        } else {
            var returnNumber = -1;
        }

        if (this.remaining === 0) {
            if (this.isLoop) {
                shuffle(randomArray);
                this.remaining = randomArray.length;
            } else {
                this.endFlag = true
            }

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
var cards = new DrawingCard(totalRect, false);



var colorScale = d3.scaleLinear()
    .domain(d3.extent(cards.randomArray))
    .range(['red', 'blue'])

function Color() {
    this.r = Math.floor(Math.random() * 255);
    this.g = Math.floor(Math.random() * 255);
    this.b = Math.floor(Math.random() * 255);
    this.color = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',0.8)';
}
var g = svg.append('g');

g.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height);

g.append('text')
    .text('Start')
    .attr('x', width / 2)
    .attr('y', height / 2)

var dispatch = d3.dispatch('startDrawing');
dispatch.on('startDrawing', draw);

if (isMobil) {
    g.select('rect')
        .style('fill', '#29aba4')
        .on('touch', function () {
            dispatch.call('startDrawing')
        })

} else {
    g.select('rect')
        .style('fill', '#354458')
        .on('click', function () {
            dispatch.call('startDrawing')
        })
}





function draw() {
    d3.select('text')
        .remove();
    var elements = []
    svg.append('g').selectAll('rect')
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
        .each(function (d, i) {
            elements.push(d3.select(this))
        })

    var delay = 30;
    var blocksPerDelay = totalRect / time / 1000 * delay;
    var blocksPerDelayCeil = Math.ceil(blocksPerDelay);
    var loopTimes = Math.ceil(totalRect / blocksPerDelayCeil)

    for (var i = 0; i < loopTimes; i++) {

        setTimeout(function (blocks) {
            for (var i = 0; i < blocks; i++) {
                var cardsNext = cards.next();
                if (cardsNext !== -1) {
                    elements[cardsNext].style('opacity', 1)
                }
            }

        }, i * delay, blocksPerDelayCeil)
    }
}

