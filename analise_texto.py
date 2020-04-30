import json
# Reduz o tamanho das palavras das cidades pra caber no plot (gabiarra total)
def reduz_cidade(entry):
    cidades = {
    "RIO DE JANEIRO" : "RJ",
    "SAO JOSE DOS CAMPOS" : "SJC",
    "SAO PAULO" : "SP",
    "BELO HORIZONTE": "BH",
    "JUIZ DE FORA" : "JF",
    "FORTALEZA" : "FORTAL",
    "RIBEIRAO PRETO": "RP",
    "CURITIBA": "CWB",
    "PORTO ALEGRE": "PA"
    }

    for cidade in cidades:
        if cidade in entry:
            return cidades[cidade]
    return entry
###


diretorio_entrada = "coleguinhas_raw"
# Incializações
coleguinhas = []
cidades = []
contagem = []
notas = [[],[], []]
medias = [0,0,0,0,0,0]

# magia negra pra pegar os dados de cada candidato.
with open(diretorio_entrada) as arq:
    for line in arq:
         if ("-" not in line and "MEDIA" not in line and "FASE" not in line):
             if line[2:43] != '':
                 coleguinhas.append((line[2:43], float(line[46:53].replace(',', '.')), float(line[56:63].replace(',', '.')),
                 float(line[64:71].replace(',', '.')), float(line[72:79].replace(',', '.')),
                 float(line[80:87].replace(',', '.')), float(line[88:95].replace(',', '.')),
                 int(line[96:101]), line[104:124]))

coleguinhas_dicts = []
for coleguinha in coleguinhas:
    nome = coleguinha[0].strip() #Remover o espaço em branco em torno do nome
    coleguinhas_dicts.append({
    "Nome": nome,
    "Média primeira fase": coleguinha[1],
    "MAT": coleguinha[2],
    "FIS": coleguinha[3],
    "QUIM": coleguinha[4],
    "RED": coleguinha[5],
    "Média final": coleguinha[6],
    "Classificação": coleguinha[7],
    "Cidade": coleguinha[8].strip()
    })
##Converter para json
with open("dados/dados.json", 'w') as arquivo:
    json.dump(coleguinhas_dicts, arquivo, ensure_ascii=False)
"""
############## Sort por cidade ########################################
# implementar um plot bonitinho aqui no futuro pfvr
for coleguinha in coleguinhas:
    if reduz_cidade(coleguinha[8]) in cidades:
        contagem[cidades.index(reduz_cidade(coleguinha[8]))] += 1
    else:
        cidades.append(reduz_cidade(coleguinha[8]))
        contagem.append(1)
#######################################################################
"""
