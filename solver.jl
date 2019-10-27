using SymPy

@vars a b c xt yt x y
# x = symbols("xt, x, yt, x, a, b, c", real=true)

yt = a*xt^2 + b*xt + c
ex1 = (yt - y)/(xt - x)
ex2 = diff(yt,xt)
solve(ex1 - ex2,xt)
