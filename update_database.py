# https://github.com/ozgur/python-firebase

import firebase

if __name__ == '__main__':
    
    DSN = 'https://concert-calendar.firebaseio.com/'
    firebase = firebase.FirebaseApplication(DSN)

    # Test data
    data = {
          "entry001": {
            "artist": "Mounties",
            "venue": "Lee's Palace",
            "date": "Saturday, Nov 1",
            "price": 20.00
          },
          "entry002": {
            "artist": "Mother Mother",
            "venue": "The Horseshoe Tavern",
            "date": "Monday, Sept 15",
            "price": "SOLD OUT"
          }
    }
    
    node = '/' + 'current-concerts'

    # Delete existing data
    firebase.delete(node, None)

    # Add new data
    firebase.post(node, data)

    # Fetch new data
    result = firebase.get(node, None)
    print result    

    print "\ndone"
