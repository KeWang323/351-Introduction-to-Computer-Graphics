clc;
clear;
A=zeros(41,3);
A(1,:) = [-50;0;0];
for i = 2 : 2 : 40
    A(i,1) = -50 + (i-2)/2 * 5;
    A(i,2) = 5;
    A(i,3) = 5* sin(i/2/10 * 2 * pi);
end
for i = 3 : 2 : 41
    A(i,1) = -50 + (i-1)/2 * 5;
    A(i,2) = 0;
end

normal = jian(20,18,20,19,A);