require 'pry'
require 'RMagick'
include Magick

BRUSH_SOURCE = 'images/brush_src.png'
BRUSH_LIGHT_DESTINATION = 'images/brush_light.png'
BRUSH_DARK_DESTINATION = 'images/brush_dark.png'
LIGHT_COLOR = [Magick::QuantumRange, Magick::QuantumRange, Magick::QuantumRange]
DARK_COLOR = [71 * Magick::QuantumRange / 256,
               31 * Magick::QuantumRange / 256,
               27 * Magick::QuantumRange / 256]

def create_brush(source, destination, color)
  brush = ImageList.new(source).first

  brush.columns.times do |x|
    brush.rows.times do |y|
      px = brush.pixel_color(x, y)
      px.opacity = Magick::QuantumRange - (px.red + px.green + px.blue) / 30
      px.red = color[0]
      px.green = color[1]
      px.blue = color[2]
      brush.pixel_color(x, y, px)
    end
  end

  brush.write(destination)
end

create_brush(BRUSH_SOURCE, BRUSH_LIGHT_DESTINATION, LIGHT_COLOR)
create_brush(BRUSH_SOURCE, BRUSH_DARK_DESTINATION, DARK_COLOR)
