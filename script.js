document.addEventListener("DOMContentLoaded", function(){
	var grille = document.getElementById("grille");
	var grillediv = document.getElementById("grille");
	var sum = 0;
	var spawn = 0;
	var	scorediv = document.getElementById("score");
	var infoText = document.getElementById("text");
	var best = 0;
	var	bestElem = infoText.getElementsByTagName("p")[0];
	var win_status = 0;
	var score = 0;
	var addition = 0;

	document.getElementsByTagName("header")[0].getElementsByTagName("a")[0].onclick = function()
	{
		grillediv.removeAttribute("class");
		document.getElementById("over").style.display = "none";
		localStorage.removeItem('grille')
		resetscore();
		initbest();
		initgrille();
	}
	initbest();
	initgrille();

	function updategrille(touche)
	{
		var div;
		var ex;
		var y;

		for(y = 0; y < 4; y++)
		{
			for(x = 0; x < 4; x++)
			{
				div = grillediv.getElementsByTagName("div")[(y * 4) + x];

				if(grille[y][x] !== -1)
				{
					div.innerHTML = grille[y][x];
					div.setAttribute("class", "nbr_" + grille[y][x]);
				}
				else
				{
					div.innerHTML = "";
					div.setAttribute("class", "nbr_" + "none");
				}
			}
		}
	}
	function zero(touche)
	{
		var x;
		var y;

		if(touche === "up")
		{
			for(y = 3; y > -1; y--)
			{
				for(x = 0; x < 4; x++)
				{
					if(y != 0 && grille[y][x] !== -1 && grille[y - 1][x] === -1)
					{
						grille[y - 1][x] = grille[y][x];
						grille[y][x] = -1;
						spawn = 1;
						zero(touche);
					}
				}
			}
		}

		else if(touche === "right")
		{
			for(x = 0; x < 4; x++)
			{
				for(y = 0; y < 4; y++)
				{
					if(x != 3 && grille[y][x] !== -1 && grille[y][x + 1] === -1)
					{
						grille[y][x + 1] = grille[y][x];
						grille[y][x] = -1;
						spawn = 1;
						zero(touche);
					}
				}
			}
		}
		else if(touche === "left") 
		{
			for(x = 3; x > -1; x--)
			{
				for(y = 3; y > -1; y--)
				{
					if(x != 0 && grille[y][x] !== -1 && grille[y][x - 1] === -1)
					{
						grille[y][x - 1] = grille[y][x];
						grille[y][x] = -1;
						spawn = 1;
						zero(touche);
					}
				}
			}
		}
		else if(touche === "down")
		{
			for(y = 0; y < 4; y++)
			{
				for(x = 3; x > -1; x--)
				{
					if(y != 3 && grille[y][x] !== -1 && grille[y + 1][x] === -1)
					{
						grille[y + 1][x] = grille[y][x];
						grille[y][x] = -1;
						spawn = 1;
						zero(touche);
					}
				}
			}
		}
	}
	function deplacement(touche)
	{
		var x;
		var y;
		spawn = 0;
		zero(touche);
		if(touche === "up")
		{
			for(y = 0; y < 4; y++)
			{
				for(x = 0; x < 4; x++)
				{
					if(y != 3 && grille[y][x] > 0)
					{
						if(grille[y + 1][x] === grille[y][x])
						{
							updatescore(grille[y][x]);
							grille[y][x] = -1;
							grille[y + 1][x] *= 2;
							spawn = 1;
						}

					}
				}
			}
		}
		else if(touche === "down")
		{
			for(y = 3; y > -1; y--)
			{
				for(x = 0; x < 4; x++)
				{
					if(y != 0 && grille[y][x] > 0)
					{
						if(grille[y - 1][x] === grille[y][x])
						{
							updatescore(grille[y][x]);
							grille[y][x] = -1;
							grille[y - 1][x] *= 2;
						}
					}
				}
			}
		}
		else if(touche === "right")
		{
			for(x = 3; x > -1; x--)
			{
				for(y = 0; y < 4; y++)
				{
					if(x !== 0 && grille[y][x] > 0)
					{
						if(grille[y][x - 1] === grille[y][x])
						{
							updatescore(grille[y][x]);
							grille[y][x] = -1;
							grille[y][x - 1] *= 2;
						}
					}
				}
			}
		}
		else if(touche === "left")
		{
			for(x = 0; x < 4; x++)
			{
				for(y = 0; y < 4; y++)
				{
					if(x !== 3 && grille[y][x] > 0)
					{
						if(grille[y][x + 1] === grille[y][x])
						{
							updatescore(grille[y][x]);
							grille[y][x] =  -1;
							grille[y][x + 1] *= 2;
						}
					}
				}
			}
		}
		zero(touche);
		if(spawn == 1)
			random();
		backup();
		updategrille(touche);
		if(checkgameover() === true)
			gameover();
	}
	function backup()
	{
		var i = JSON.stringify(grille);
		localStorage.setItem("score_en_cours", score);
		localStorage.setItem("grille", i);

	}
	function updatescore(nbr)
	{
		score += nbr * 2;
		if(nbr * 2 === 2048)
			win();
		updateBest();
		scorediv.textContent = score + " pts";

	}
	function gameover()
	{
		grillediv.setAttribute("class", "over");
		document.getElementById("over").style.display = "block";
	}
	function win()
	{
		win_status = 1;
		grillediv.setAttribute("class", "over");
		document.getElementById("win").style.display = "block";
	}

	function keyPress(code) 
	{
		if(code === 37)
			deplacement('left');
		else if(code === 38)
			deplacement('up');
		else if(code === 39)
			deplacement('right');
		else if(code === 40)
			deplacement('down');
		else if(code === 65)
			solver();

	}


	function random() 
	{
		var x;
		var y;
		var coucou = [];

		for(y = 0; y < 4; y++)
		{
			for(x = 0; x < 4; x++)
			{
				if(grille[y][x] === -1)
					coucou.push([x, y]);
			}
		}

		if(coucou.length)
		{
			if(Math.floor(Math.random() * 9) === 8)
				var randomValue = 4;
			else
				var randomValue = 2;

			var randomBlock = coucou[(Math.floor(Math.random() * coucou.length))];
			var x = randomBlock[0];
			var y = randomBlock[1];

			grille[y][x] = randomValue;
		}
		else
		{
			if(checkgameover() === true)
				gameover();
		}
	}

	function checkgameover()
	{
		for(y = 0; y < 4; y++)
		{
			for(x = 0; x < 4; x++)
			{
				if(grille[y][x] === -1)
					return false;
				else if((y < 3 && grille[y][x] === grille[y + 1][x]) || (x < 3 && grille[y][x] === grille[y][x + 1]))
					return false;
			}
		}
		return true;
	}

	function resetscore()
	{
		score = 0;
		sum = 0;
		localStorage.removeItem('score_en_cours')

		updatescore(0);
	}

	function initgrille()
	{
		if(localStorage.getItem("grille") !== null)
		{
			var i = localStorage.getItem("grille");
			score = parseInt(localStorage.getItem("score_en_cours"));
			grille = JSON.parse(i);
		}
		else
		{
			grille = [[-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1], [-1, -1, -1, -1]];
			random();
			random();
		}
		updategrille();
	}
	function getbest()
	{
		best = localStorage.getItem("bestscore2048");
		bestElem.innerHTML = "Best score : " + best + "pts";

	}

	function setbest(score)
	{
		localStorage.setItem("bestscore2048", score);
		best = score;
	}

	function updateBest()
	{
		if(best <score)
			setbest(score);

		bestElem.innerHTML = "Best score : " + best + "pts";
	}
	function initbest()
	{
		if(localStorage.getItem("bestscore2048") === undefined)
			setbest(0);

		getbest();
	}
	document.onkeydown = function(e)
	{
		if(win_status == 1)
		{
			grillediv.setAttribute("class", "");
			document.getElementById("win").style.display = "none";
			win_status = 0;
		}
		keyPress(e.keyCode);
	}
	function solver()
	{
		var res = [0,0,0,0];
		var res_addition = [0,0,0,0];
		var touche = 0;
		var add = 0;
		var choix = [];
		var comparer = [];
		var count_res = [];

		res[0] = count_empty(test_deplacement('up'));
		res_addition[0] = progressive(test_deplacement('up'), 'up');
		comparer[0] = compare(test_deplacement('up'));
		count_res[0] = reguliere(test_deplacement('up'));

		res[1] = count_empty(test_deplacement('down'));
		res_addition[1] = progressive(test_deplacement('down'), 'down'); 
		comparer[1] = compare(test_deplacement('down'));
		count_res[1] = reguliere(test_deplacement('down'));

		res[2] = count_empty(test_deplacement('right'));
		res_addition[2] = progressive(test_deplacement('right'), 'right');
		comparer[2] = compare(test_deplacement('right'));
		count_res[2] = reguliere(test_deplacement('right'));

		res[3] = count_empty(test_deplacement('left'));
		res_addition[3] = progressive(test_deplacement('left'), 'left'); 
		comparer[3] = compare(test_deplacement('left'));
		count_res[3] = reguliere(test_deplacement('left'));

		var i = 0;
		var res_res = [0,0,0,0];

		while(i < 4)
		{
			if(comparer[i] !==  true)
			{
				if(i == res_addition.indexOf(Math.max(...res_addition)))
					res_res[i]++;
				if(i == res.indexOf(Math.max(...res)))
					res_res[i]++;
				if(i == count_res.indexOf(Math.max(...count_res)))
					res_res[i]++;

			}
			else
			{
				res[i] = 0;
				res_addition[i] = 0;
				count_res[i] = 0;
			}
			i++;
		}
		console.log(res_addition);
		touche = res_res.indexOf(Math.max(...res_res));
		if(touche == 0)
			deplacement('up')
		else if(touche == 1)
			deplacement('down')
		else if(touche == 2)
			deplacement('right')
		else if(touche == 3)
			deplacement('left')
	}
	function reguliere(grille_res)
	{
		var count = 0;
		for(y = 0; y < 4; y++)
		{
			if((grille_res[y][0] / 2 == grille_res[y][1] || grille_res[y][0] == -1) && (grille_res[y][1] / 2 == grille_res[y][2] || grille_res[y][1] == -1) && (grille_res[y][2] / 2 == grille_res[y][3]  || grille_res[y][2] == -1 || grille_res[y][3] == -1))
				count++;
			else if((grille_res[y][0] * 2 == grille_res[y][1] || grille_res[y][0] == -1) && (grille_res[y][1] * 2 == grille_res[y][2] || grille_res[y][1] == -1) && (grille_res[y][2] * 2 == grille_res[y][3]  || grille_res[y][2] == -1 || grille_res[y][3] == -1))
				count++;

		}
		for(x = 0; x < 4; x++)
		{
			if((grille_res[0][x] / 2 == grille_res[1][x] || grille_res[0][x] == -1) && (grille_res[1][x] / 2 == grille_res[2][x] || grille_res[1][x] == -1) && (grille_res[2][x] / 2 == grille_res[3][x]  || grille_res[2][x] == -1 || grille_res[3][x] == -1))
				count++;
			else if((grille_res[0][x] * 2 == grille_res[1][x] || grille_res[0][x] == -1) && (grille_res[1][x] * 2 == grille_res[2][x] || grille_res[1][x] == -1) && (grille_res[2][x] * 2 == grille_res[3][x]  || grille_res[2][x] == -1 || grille_res[3][x] == -1))
				count++;

		}
		return count;
	}
	function progressive(grille_res, touche)
	{
		var addition = 0;
		if(touche == 'right' || touche == 'left')
		{
			if(touche == 'left')
			{
				for(y = 0; y < 4; y++)
				{
					if(grille_res[y][0] != -1 && grille_res[y][1] != -1 && grille_res[y][2] != -1 && grille_res[y][3] != -1)
					{
						if(grille_res[y][0] >= grille_res[y][1] && grille_res[y][1] >= grille_res[y][2] && grille_res[y][2] >= grille_res[y][3])
						{
							addition++;
						}
						else if(grille_res[y][0] <= grille_res[y][1] && grille_res[y][1] <= grille_res[y][2] && grille_res[y][2] <= grille_res[y][3])
						{
							addition++;
						}
					}
					else if(grille_res[y][2] == -1 && grille_res[y][3] == -1 && grille[y][1] != -1)
					{					
						if(grille_res[y][0] >= grille_res[y][1])
						{
							addition++;
						}
						else if(grille_res[y][0] <= grille_res[y][1])
						{
							addition++;
						}
					}
					else if(grille_res[y][3] == -1 && grille[y][2] != -1)
					{
						if(grille_res[y][0] >= grille_res[y][1] && grille_res[y][1] >= grille_res[y][2])
						{
							addition++;
						}
						else if(grille_res[y][0] <= grille_res[y][1] && grille_res[y][1] <= grille_res[y][2])
						{
							addition++;
						}
					}
				}
			}
			else if(touche == 'right')
			{
				for(y = 0; y < 4; y++)
				{

					if(grille_res[y][0] != -1 && grille_res[y][1] != -1 && grille_res[y][2] != -1 && grille_res[y][3] != -1)
					{
						if(grille_res[y][0] >= grille_res[y][1] && grille_res[y][1] >= grille_res[y][2] && grille_res[y][2] >= grille_res[y][3])
						{
							addition++;
						}
						else if(grille_res[y][0] <= grille_res[y][1] && grille_res[y][1] <= grille_res[y][2] && grille_res[y][2] <= grille_res[y][3])
						{
							addition++;
						}
					}
					else if(grille_res[y][0] == -1 && grille_res[y][1] == -1 && grille[y][2] != -1)
					{					
						if(grille_res[y][2] >= grille_res[y][3])
						{
							addition++;
						}
						else if(grille_res[y][2] <= grille_res[y][3])
						{
							addition++;
						}
					}
					else if(grille_res[y][0] == -1 && grille[y][1] != -1)
					{
						if(grille_res[y][1] >= grille_res[y][2] && grille_res[y][2] >= grille_res[y][3])
						{
							addition++;
						}
						else if(grille_res[y][1] <= grille_res[y][2] && grille_res[y][2] <= grille_res[y][3])
						{
							addition++;
						}

					}
				}	
			}
		}
		else if( touche == 'up' || touche == 'down')
		{
			if(touche == 'up')
			{
				for(x = 0; x < 4; x++)
				{
					if(grille_res[0][x] != -1 && grille_res[1][x] != -1 && grille_res[2][x] != -1 && grille_res[3][x] != -1)
					{
						if(grille_res[0][x] >= grille_res[1][x] && grille_res[1][x] >= grille_res[2][x] && grille_res[2][x] >= grille_res[3][x])
						{
							addition++;
						}
						else if(grille_res[0][x] <= grille_res[1][x] && grille_res[1][x] <= grille_res[2][x] && grille_res[2][x] <= grille_res[3][x])
						{
							addition++;
						}
					}
					else if(grille_res[2][x] == -1 && grille_res[3][x] == -1 && grille_res[1][x] != -1)
					{					
						if(grille_res[0][x] >= grille_res[1][x])
						{
							addition++;
						}
						else if(grille_res[0][x] <= grille_res[1][x])
						{
							addition++;
						}
					}
					else if(grille_res[3][x] == -1 && grille_res[1][x] != -1)
					{
						if(grille_res[0][x] >= grille_res[1][x] && grille_res[1][x] >= grille_res[2][x])
						{
							addition++;
						}
						else if(grille_res[0][x] <= grille_res[1][x] && grille_res[1][x] <= grille_res[2][x])
						{
							addition++;
						}
					}
				}
				for(y = 0; y < 4; y++)
				{

					if(grille_res[y][0] != -1 && grille_res[y][1] != -1 && grille_res[y][2] != -1 && grille_res[y][3] != -1)
					{
						if(grille_res[y][0] >= grille_res[y][1] && grille_res[y][1] >= grille_res[y][2] && grille_res[y][2] >= grille_res[y][3])
						{
							addition++;
						}
						else if(grille_res[y][0] <= grille_res[y][1] && grille_res[y][1] <= grille_res[y][2] && grille_res[y][2] <= grille_res[y][3])
						{
							addition++;
						}
					}
					else if(grille_res[y][0] == -1 && grille_res[y][1] == -1 && grille[y][2] != -1)
					{					
						if(grille_res[y][2] >= grille_res[y][3])
						{
							addition++;
						}
						else if(grille_res[y][2] <= grille_res[y][3])
						{
							addition++;
						}
					}
					else if(grille_res[y][0] == -1 && grille[y][1] != -1)
					{
						if(grille_res[y][1] >= grille_res[y][2] && grille_res[y][2] >= grille_res[y][3])
						{
							addition++;
						}
						else if(grille_res[y][1] <= grille_res[y][2] && grille_res[y][2] <= grille_res[y][3])
						{
							addition++;
						}

					}
				}
			}
			else if(touche == 'down')
			{
				for(x = 0; x < 4; x++)
				{
					if(grille_res[0][x] != -1 && grille_res[1][x] != -1 && grille_res[2][x] != -1 && grille_res[3][x] != -1)
					{
						if(grille_res[0][x] >= grille_res[1][x] && grille_res[1][x] >= grille_res[2][x] && grille_res[2][x] >= grille_res[3][x])
						{
							addition++;
						}
						else if(grille_res[0][x] <= grille_res[1][x] && grille_res[1][x] <= grille_res[2][x] && grille_res[2][x] <= grille_res[3][x])
						{
							addition++;
						}
					}
					else if(grille_res[0][x] == -1 && grille_res[1][x] == -1 && grille_res[2][x] != -1)
					{					
						if(grille_res[2][x] >= grille_res[3][x])
						{
							addition++;
						}
						else if(grille_res[2][x] <= grille_res[3][x])
						{
							addition++;
						}
					}
					else if(grille_res[0][x] == -1 && grille_res[2][x] != -1)
					{
						if(grille_res[1][x] >= grille_res[2][x] && grille_res[2][x] >= grille_res[3][x])
						{
							addition++;
						}
						else if(grille_res[1][x] <= grille_res[2][x] && grille_res[2][x] <= grille_res[3][x])
						{
							addition++;
						}
					}
				}		
			}
		}
		return addition;

	}
	function compare(new_c)
	{
		for(y = 0; y < 4; y++)
		{
			for(x = 0; x < 4; x++)
			{
				if(grille[y][x] != new_c[y][x])
					return false;
			}
		}
		return true;
	}
	function count_empty(grille_res)
	{
		var count = 0;
		for(y = 0; y < 4; y++)
		{
			for(x = 0; x < 4; x++)
			{
				if(grille_res[y][x] === -1)
					count++;
			}
		}
		return count;
	}
	function zero_solver(touche, grille_res)
	{
		var x;
		var y;

		if(touche === "up")
		{
			for(y = 3; y > -1; y--)
			{
				for(x = 0; x < 4; x++)
				{
					if(y != 0 && grille_res[y][x] !== -1 && grille_res[y - 1][x] === -1)
					{
						grille_res[y - 1][x] = grille_res[y][x];
						grille_res[y][x] = -1;
						spawn = 1;
						zero_solver(touche, grille_res);
					}
				}
			}
		}

		else if(touche === "right")
		{
			for(x = 0; x < 4; x++)
			{
				for(y = 0; y < 4; y++)
				{
					if(x != 3 && grille_res[y][x] !== -1 && grille_res[y][x+1] === -1)
					{
						grille_res[y][x + 1] = grille_res[y][x];
						grille_res[y][x] = -1;
						spawn = 1;
						zero_solver(touche, grille_res);
					}
				}
			}
		}
		else if(touche === "left") 
		{
			for(x = 3; x > -1; x--)
			{
				for(y = 3; y > -1; y--)
				{
					if(x != 0 && grille_res[y][x] !== -1 && grille_res[y][x - 1] === -1)
					{
						grille_res[y][x - 1] = grille_res[y][x];
						grille_res[y][x] = -1;
						spawn = 1;
						zero_solver(touche, grille_res);
					}
				}
			}
		}
		else if(touche === "down")
		{
			for(y = 0; y < 4; y++)
			{
				for(x = 3; x > -1; x--)
				{
					if(y != 3 && grille_res[y][x] !== -1 && grille_res[y + 1][x] === -1)
					{
						grille_res[y + 1][x] = grille_res[y][x];
						grille_res[y][x] = -1;
						spawn = 1;
						zero_solver(touche, grille_res);
					}
				}
			}
		}
		return grille_res;
	}
	function test_deplacement(touche)
	{
		var grille_res =  JSON.parse(JSON.stringify(grille))
		var x;
		var y;
		spawn = 0;
		addition = 0;
		zero_solver(touche, grille_res);
		if(touche === "up")
		{
			for(y = 0; y < 4; y++)
			{
				for(x = 0; x < 4; x++)
				{
					if(y != 3 && grille_res[y][x] > 0)
					{
						if(grille_res[y + 1][x] === grille_res[y][x])
						{
							grille_res[y][x] = -1;
							grille_res[y + 1][x] *= 2;
						}							
					}
				}
			}
		}
		else if(touche === "down")
		{
			for(y = 3; y > -1; y--)
			{
				for(x = 0; x < 4; x++)
				{
					if(y != 0 && grille_res[y][x] > 0)
					{
						if(grille_res[y - 1][x] === grille_res[y][x])
						{
							grille_res[y][x] = -1;
							grille_res[y - 1][x] *= 2;
							
						}
					}
				}
			}
		}
		else if(touche === "right")
		{
			for(x = 3; x > -1; x--)
			{
				for(y = 0; y < 4; y++)
				{
					if(x !== 0 && grille_res[y][x] > 0)
					{
						if(grille_res[y][x - 1] === grille_res[y][x])
						{
							grille_res[y][x] = -1;
							grille_res[y][x - 1] *= 2;
						}
					}
				}
			}
		}
		else if(touche === "left")
		{
			for(x = 0; x < 4; x++)
			{
				for(y = 0; y < 4; y++)
				{
					if(x !== 3 && grille_res[y][x] > 0)
					{
						if(grille_res[y][x + 1] === grille_res[y][x])
						{
							grille_res[y][x] =  -1;
							grille_res[y][x + 1] *= 2;
						}
					}
				}
			}
		}
		zero_solver(touche, grille_res);
		if(checkgameover() === true)
			gameover();
		return grille_res;
	}
});