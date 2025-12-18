extends CharacterBody3D

@export var speed: float = 3.0
@export var wander_radius: float = 12.0
@export var repath_time: float = 2.5

@onready var agent: NavigationAgent3D = $NavigationAgent3D

var _timer := 0.0
var _origin: Vector3

func _ready() -> void:
	_origin = global_position
	_pick_new_target()

func _physics_process(delta: float) -> void:
	_timer -= delta
	if _timer <= 0.0 or agent.is_navigation_finished():
		_pick_new_target()

	# Prochaine position sur le chemin
	var next_pos: Vector3 = agent.get_next_path_position()
	var dir: Vector3 = (next_pos - global_position)
	dir.y = 0.0

	if dir.length() > 0.05:
		dir = dir.normalized()
		velocity.x = dir.x * speed
		velocity.z = dir.z * speed
	else:
		velocity.x = move_toward(velocity.x, 0.0, speed)
		velocity.z = move_toward(velocity.z, 0.0, speed)

	move_and_slide()

	# Orientation (optionnel)
	if Vector3(velocity.x, 0, velocity.z).length() > 0.1:
		look_at(global_position + Vector3(velocity.x, 0, velocity.z), Vector3.UP)

func _pick_new_target() -> void:
	_timer = repath_time + randf() * repath_time

	# Point aléatoire autour de l’origine
	var offset := Vector3(
		randf_range(-wander_radius, wander_radius),
		0.0,
		randf_range(-wander_radius, wander_radius)
	)
	var desired := _origin + offset

	# Projette sur le NavMesh (évite des points hors nav)
	var map := agent.get_navigation_map()
	var safe := NavigationServer3D.map_get_closest_point(map, desired)

	agent.target_position = safe
