arr = [2.1, 4, 'HYD', 8, 6.5, 5, "AC"]

a = []
b = []
c = 0


for i in arr:
    if type(i) in [int, float]:
        a.append(i)
        if type(i) == float:
            c += 1
    elif type(i) == str:
        b.append(i)
print("number :" + str(a))
print('Strings:' + str(b))
print('Float Count: ' + str(c))
