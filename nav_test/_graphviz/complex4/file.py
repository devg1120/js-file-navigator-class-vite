from graphviz import Source
path = 'g.dot'
s = Source.from_file(path, format = "svg")
s.view()

