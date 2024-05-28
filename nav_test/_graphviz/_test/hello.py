import graphviz

# Graphvizのオブジェクトを作成 --- (*1)
g = graphviz.Digraph(format='svg', filename='test')

# ノードを3つ作成 --- (*2)
g.node('い')
g.node('ろ')
g.node('は')

# ノードを接続する --- (*3)
g.edge('い', 'ろ')
g.edge('ろ', 'は')

# 表示
g.view()

