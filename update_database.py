# https://github.com/ozgur/python-firebase
#Alex was here
import firebase
import urllib2
import string

def Upload_to_Firebase(json):
    DSN = 'https://<application>.firebaseio.com/'
    database = firebase.FirebaseApplication(DSN)

    node = '/' + 'current-concerts'

    # Delete existing data
    database.delete(node, None)

    # Add new data
    database.post(node, json)

    # Fetch new data
    #result = database.get(node, None)
    #print result

def Build_json(html):
    result = []    
    for h in html:        
        if h[4:12] == "<strong>" or h[4:12] == "<strike>":
            result.append(h[12:-15])
        else:
            result.append(h[4:-6])    
    return result

def main():
    url = "http://www.soundscapesmusic.com/tickets/"
    page = urllib2.urlopen(url).read().split("\n")

    count = 0
    entry = -1
    htmlList = []
    data = {}

    for line in page:
        if line.startswith("<tr>"):
            if entry == -1:
                entry +=1
            else:
                item = Build_json(page[count+1:count+5])
                data["show-"+str(entry)] = {
                    "artist" : item[0],
                    "venue" : item[1],
                    "date" : item[2],
                    "price" : item[3]                 
                    }
                entry +=1
        count +=1
    

    Upload_to_Firebase(data)      

if __name__ == '__main__':
    main()
    print "done"
