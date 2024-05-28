from graphviz import Source
path = 'file.gv'
s = Source.from_file(path, format = "svg")
s.view()

