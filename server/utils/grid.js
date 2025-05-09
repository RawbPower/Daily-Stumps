function Grid(rows, cols)
{
    this.value = new Array(rows*cols).fill(0);
    this.rows = rows;
    this.cols = cols;
}

Grid.prototype.get = function(i, j)
{
    return this.value[j + i*rows];
}