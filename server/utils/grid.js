function Grid(rows, cols)
{
    this.value = new Array(rows*cols).fill(0);
    this.rows = rows;
    this.cols = cols;
}

Grid.prototype.get = function(i, j)
{
    if (arguments.length === 2)
    {
        return this.value[j + i*this.cols];
    }
    else if (arguments.length === 1)
    {
        return this.value[i];
    }
    else
    {
        return this.value
    }
}

Grid.prototype.set = function(x, i, j)
{
    if (arguments.length === 3)
    {
        this.value[j + i*this.cols] = x;
    }
    else if (arguments.length === 2)
    {
        this.value[i] = x;
    }
    else if (arguments.length === 2)
    {
        this.value = x;
    }
}

Grid.prototype.length = function()
{
    return this.value.length;
}

Grid.prototype.log = function()
{
    let gridString = "";
    for (let i = 0; i < this.value.length; i++)
    {
        gridString += this.value[i] + ", ";
        if (i % this.cols == this.cols - 1)
        {
            gridString += "\n";
        }
    }

    console.log(gridString);
}

module.exports = {
	Grid
}