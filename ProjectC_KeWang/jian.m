function result = jian(n1,n2,y1,y2,A)
a = A(n1,:) - A(n2,:);
b = A(y1,:) - A(y2,:);
result = cross(a,b);
end