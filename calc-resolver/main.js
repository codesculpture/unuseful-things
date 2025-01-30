const resolveExpression = (inp) => {
	let scope = 0;
	const vals = [];
	let currentContext = [];
	while(inp.length) {
		console.log(inp);
		if(inp[0] === ' ' || inp[0] === '_') inp = inp.substring(1);
		else if(inp.startsWith("calc(")) {
			scope++;
			inp = inp.substring("calc(".length);
			currentContext.push(0);
		}

		else if(inp.startsWith("rem")) {
			inp = inp.substring("rem".length);
		}

		else if(inp.startsWith("var(--spacing)")) {
			inp = inp.substring("var(--spacing)".length);
			vals.push(0.1);
		}


		else if(["+", "-", "*", "/"].includes(inp[0])) {
			currentContext[currentContext.length - 1]++;
			vals.push(inp[0]);
			inp = inp.substring(1);
		}
		else if(!isNaN(inp[0])) {
			let targetNum = inp[0];
			let isFloat = false;
			if(inp[1] === '.')  {
				isFloat = true;
				inp = inp.substring(2);
				targetNum += '.';
				while(!isNaN(inp[0])) {
					targetNum += inp[0];
					inp = inp.substring(1);
				}
			}
			else {
				inp = inp.substring(1);
			}

			vals.push(isFloat ? parseFloat(targetNum) : parseInt(targetNum));
		}
		else if(inp[0] == ")") {
			// console.log("VALS", vals);
			let operatorsPendingInThisScope = currentContext[currentContext.length - 1];
			// console.log("currentContext", operatorsPendingInThisScope);
			currentContext.splice(-1, 1);
			scope--;

			let i = operatorsPendingInThisScope;
			const contextVals = vals.splice(-((operatorsPendingInThisScope * 2) + 1), (operatorsPendingInThisScope * 2) + 1);

			while(i > 0) {
				const pos = (i * 2) + 1;
				const y = -(pos - 2), x = -pos, z = -(pos-1);

				const b = contextVals.at(y), a = contextVals.at(x), o = contextVals.at(z);

				let ans;
				if(o === "*") {
					ans = a * b;
				}
				else if(o === "+") {
					ans = a + b;
				}
				else if(o === "-") {
					ans = a - b;
				}
				else if(o === "/") {
					ans = a / b;
				}
				// console.log("X", x);
				// console.log("Y", y);
				// console.log("Z", z);
				// console.log("A", a);
				// console.log("B", b);
				// console.log("O", o);
				// console.log("ANS", ans);
				contextVals.splice(0, 3);
				contextVals.unshift(ans);
				i--;
			}

			vals.push(contextVals[0]);
			inp = inp.substring(1);
		}
	}
	if(scope !== 0) console.log("Parantheses error")
	return vals[0];
}

console.log(resolveExpression("calc(4rem_-_calc(2.4rem_-_calc(calc(var(--spacing)_*_2)_*_2))_-_calc(calc(var(--spacing)_*_2)_*_2))"));
