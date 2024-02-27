// Sample data
const data = {
    "latestBackupDates": [
      {
        "_id": "65d03e359f39067165da8433",
        "backupDate": "17/02/2024"
      },
      {
        "_id": "65d03e4a9f39067165da86a9",
        "backupDate": "17/02/2024"
      },
      {
        "_id": "65d2f72a222861394c049dc8",
        "backupDate": "19/02/2024"
      },
      {
        "_id": "65d2f7ff222861394c04a12a",
        "backupDate": "19/02/2024"
      },
      {
        "_id": "65d4aa102c697d9e78d088ed",
        "backupDate": "20/02/2024"
      }
    ]
  };
  
  // Function to remove duplicate dates from the array
  function removeDuplicateDates(data) {
    const uniqueDates = [];
    const seen = new Set();
    
    for (const item of data.latestBackupDates) {
      const { _id, backupDate } = item;
      if (!seen.has(backupDate)) {
        seen.add(backupDate);
        uniqueDates.push({ _id, backupDate });
      }
    }
    
    return { latestBackupDates: uniqueDates };
  }
  
  // Example usage
  const uniqueData = removeDuplicateDates(data);
  console.log(uniqueData);
  