extends Area3D

func _ready() -> void:
	connect("body_entered", Callable(self, "_on_body_entered"))

func _on_body_entered(body: Node) -> void:
	if body.name == "Player":
		print("Gagné !")
		# ici tu peux afficher un message, recharger la scène, etc.
