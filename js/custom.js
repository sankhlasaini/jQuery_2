$(function () 
{
	var tableData = $('#tableData');
	var totelPage ;
	var recordsToDisplay = 10;//Number of Recoard to DISPLAY
	var records = recordsToDisplay-1;
	var min = 0;
	var max = records+min;
	var allRecords ;

	function display10Record()
	{ 
		$('#bottomContent').show();
		tableData.empty();
		totelPage = allRecords.length/(records+1);
		// console.log(allRecords.length);
		// console.log(min);
		// console.log(allRecords.length%recordsToDisplay);

		max = records+min;
		for(var i=min;i<=max;i++)	
		{
			if(allRecords[i]==undefined)
			{
				console.log('data not found');
				max = i-1;
				break;
			}
			tableData.append('<tr class="dataRow"><td style="display:none;"></td><td >'
				+allRecords[i].Title+'</td><td>'+allRecords[i].Type
				+'</td><td >'+allRecords[i].Year
				+'</td><td >'+allRecords[i].id
				+'</td><td ><button id="edit" class="btn btn-info editBtn glyphicon glyphicon-edit"></button>'
				+'<button class="btn btn-danger delBtn glyphicon glyphicon-trash"></button></td></tr>');
		};
		$('#pageDetail').empty();
		$('#pageDetail').append('<b>Page : '+(min/(records+1)+1)+' / '+Math.ceil(totelPage)
			+'<br>Showing Records : '+(min+1) +' to '+ (max+1)+'</b>');
	}

	function home()
	{
		$.ajax({
			type:'GET',
			url:'http://localhost:3000/Search',
			success:function(data) 
			{
				$('#loading').remove();
				allRecords = data;
				display10Record();

			}
		});
	}

	//On Page load
	home();

	$('#homeBtn').on('click',function ()
	{
		min = 0;
		max = records+min;
		home();
	});

	// Page Jump Button Working
	$('#goBtn').on('click',function ()
	{
		var pageNumber = $('#goToPage').val()-1;
		if(pageNumber>=0 && pageNumber<totelPage)
		{
			min = (records+1)*pageNumber;
			max = min + records;
			display10Record();
		}
		else
		{
			alert('Please Enter Valid Page Number');
		}
	});

	//Next Page Button Working 
	$('#next').on('click',function ()
	{
		min = min+recordsToDisplay;
		max = max+recordsToDisplay;
		var currentPage = ((max+1)/(records+1));
		if(currentPage<=Math.ceil(totelPage)) 
		{
			display10Record();
		}
		else
		{
			min = min-recordsToDisplay;
			max = max-recordsToDisplay;
		}
	});

	//Prev Page Button Working
	$('#prev').on('click',function ()
	{
		if(min>=4)
		{
			min = min-recordsToDisplay;
			max = max-recordsToDisplay;
			display10Record();
		}
	});

	//ADD records Button Working
	$('#addBtn').on('click',function ()
	{
		var lastID = +(allRecords[allRecords.length-1].id);
		var name = $('#name').val();
		var year = +$('#year').val();
		var type = $('#type').val();
		
		if(name=='' || year==''||type=='')
		{
			alert('Please Fill all Fields');
		}
		else if(isNaN(year))
		{
			alert('Year should be an number');
		}
		else if(year<1990 || year>=(new Date().getFullYear()))
		{
			alert('Year Not allowed');
		}
		else
		{
			var newMovie =
			{
				Title : name,
				Year : year,
				id : lastID+1,
				Type : type,
			};
			$.ajax({
				type: "POST",
				url:'http://localhost:3000/Search/',
				data: newMovie,
				success:function(data) 
				{				
					tableData.append('<tr><td class="col-xs-6">'
						+name+'</td><td class="col-xs-1">'
						+type+'</td><td class="col-xs-1">'
						+year+'</td><td class="col-xs-2">'
						+(lastID+1)+'</td><td class="col-xs-1">'
						+'<button id="edit" class="editBtn glyphicon glyphicon-edit"></button></td><td class="col-xs-1">'
						+'<button class="delBtn glyphicon glyphicon-trash"></button></td></tr>');
					alert('ADDED');
					home();
				}
			});
		}
	})

	var oldName,oldImdb,oldYear,oldType;

	//Edit Button Working
	tableData.delegate('.editBtn','click',function () 
	{
		$('.editBtn').attr('disabled',true);
		oldName = ($(this).closest('tr').find('td:eq(1)').text());
		oldType = ($(this).closest('tr').find('td:eq(2)').text());
		oldYear = ($(this).closest('tr').find('td:eq(3)').text());
		oldImdb = ($(this).closest('tr').find('td:eq(4)').text());
		
		var newTr =	'<tr id="editTr">'
		+'<td class="col-xs-3"><input type="text" class="form-control" id="editName" value='
		+oldName+' placeholder="Name"></td>'
		+'<td class="col-xs-3"><input type="text" class="form-control" id="editType" value='
		+oldType+' placeholder="Type"></td>'
		+'<td class="col-xs-2"><input type="text" class="form-control" id="editYear" value='
		+oldYear+' placeholder="Year"></td>'
		+'<td class="col-xs-2">'
		+oldImdb+'</td>'
		+'<td class="col-xs-2"><button id="save" class="btn btn-success saveBtn glyphicon glyphicon-ok"></button>'
		+'<button id="close" class="btn btn-danger closeBtn glyphicon glyphicon-remove"></button></td></tr>';

		var newName ='';
		var newType ='';
		var newYear =''; 
		var editMovie = {};

		$(this).parent().parent().replaceWith(newTr);
		
		//Cancel Button Working inside Edit Records
		tableData.delegate('.closeBtn','click',function () 
		{
			$('.editBtn').attr('disabled',false);
			var oldTr =	('<tr class="dataRow"><td style="display:none;"></td><td >'
				+oldName+'</td><td>'
				+oldType+'</td><td>'
				+oldYear+'</td><td>'
				+oldImdb+'</td><td>'
				+'<button id="edit" class="btn btn-info editBtn glyphicon glyphicon-edit"></button>'
				+'<button class="btn btn-danger delBtn glyphicon glyphicon-trash"></button></td></tr>');

			$(this).parent().parent().replaceWith(oldTr);
		});

		//Save Button Working inside Edit Records
		tableData.delegate('.saveBtn','click',function () 
		{
			$('.editBtn').attr('disabled',false);
			newName = $('#editName').val();
			newYear = $('#editYear').val();
			newType = $('#editType').val();
			if($('#editName').val()=='')
			{	
				newName = oldName;
			}
			if($('#editYear').val()=='')
			{	
				newYear = oldYear;
			}
			if($('#editType').val()=='')
			{	
				newType = oldType;
			}

			var newShowTr =	('<tr class="dataRow"><td style="display:none;"></td><td>'
				+newName+'</td><td>'+newType
				+'</td><td>'+newYear+'</td><td>'+oldImdb
				+'</td><td><button id="edit" class="btn btn-info editBtn glyphicon glyphicon-edit"></button>'
				+'<button class="btn btn-danger delBtn glyphicon glyphicon-trash"></button></td></tr>');

			$(this).parent().parent().replaceWith(newShowTr);
			editMovie =
			{
				Title : newName,
				Year : newYear,
				id : oldImdb,
				Type : newType,
			};
			$.ajax({
				type: "PUT",
				url:'http://localhost:3000/Search/'+oldImdb,
				data:editMovie,

				success:function(data) 
				{
					alert("Updated : "+oldImdb);
				}
			});
		});
	})

	//Delete Record Button Working	
	tableData.delegate('.delBtn','click',function () {
		if(confirm("Are You Sure"))
		{
			var $IMDB = $(this).closest('td').prev('td').text().trim();
			$(this).closest('tr').remove();

			$.ajax({
				type: "DELETE",
				contentType:"application/json",
				url:'http://localhost:3000/Search/'+$IMDB,

				success:function(data) 
				{
					alert("DELETED : "+$IMDB);
				}
			});
		}
	})

	//Search For ID or NAME Button
	$('#searchBtn').on('click',function ()
	{
		var searchBy = $('#searchBy').val();
		var searchInput = $('#searchInput').val();

		if(searchInput=='')
		{
		}
		else
		{
			if(searchBy=='ID')
			{
				$.ajax({
					type:'GET',
					url:'http://localhost:3000/Search/'+searchInput,
					error: function (xhr) {
						alert('Sorry No Records Found');
					},
					success:function(data) 
					{
						tableData.empty();
						$('#bottomContent').hide();

						tableData.append('<tr class="dataRow"><td style="display:none;"></td><td >'
							+data.Title+'</td><td>'+data.Type
							+'</td><td>'+data.Year+'</td><td>'+data.id
							+'</td><td><button id="edit" class="btn btn-info editBtn glyphicon glyphicon-edit"></button>'
							+'<button class="btn btn-danger delBtn glyphicon glyphicon-trash"></button></td></tr>');
					}
				});
			}	
			else if(searchBy=='Name')
			{
				var mydata = allRecords;
				$('#pageDetail').empty();
				var recordFound = [];
				$.each(mydata, function( index, value ) 
				{
					if(value.Title==undefined)
					{
						console.log(value.id);
					}
					else if(value.Title.toLowerCase().split(' ')[0]==searchInput.toLowerCase())
					{
						recordFound.push(value);
					}
				});
				if(recordFound.length==0)
				{
					alert('Sorry No Record Found Try Proper Name');
				}
				else
				{
					min = 0;
					max = records+min;
					allRecords = recordFound;
					display10Record();
				}
			}
		}
	});
});
